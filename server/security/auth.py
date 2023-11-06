import os
from flask import jsonify, redirect, request, session, render_template, url_for
from app.utils.auth_helpers import get_redirection_url_for_user
from flask_cors import cross_origin
from flask_session import Session
import requests
import msal
import app_config
from app.models import user

def authentication(app):
    app.config.from_object(app_config)
    Session(app)

    from werkzeug.middleware.proxy_fix import ProxyFix
    app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

    @app.route("/api/")
    def index():
        if not session.get("user"):
            return redirect(url_for("login"))

        # check if the user exists in the database
        user_email = session["user"]["preferred_username"]
        document = user.get_user_by_email(user_email)
        if document["role"]:
            user_role = document["role"]
            return redirect(get_redirection_url_for_user(user_role)) 
        
        # otherwise get the user from Azur
        user_role = session.get("user")["roles"][0] # get the user role, by default we use the first role
        return redirect(get_redirection_url_for_user(user_role))

    @app.route("/api/login")
    def login():
        session["flow"] = _build_auth_code_flow(scopes=app_config.SCOPE)
        return redirect(session["flow"]["auth_uri"])

    @app.route(app_config.REDIRECT_PATH)  # Its absolute URL must match your app's redirect_uri set in AAD
    def authorized():
        try:
            cache = _load_cache()
            result = _build_msal_app(cache=cache).acquire_token_by_auth_code_flow(
                session.get("flow", {}), request.args)
            if "error" in result:
                return render_template("auth_error.html", result=result) # we should redirect to error page
            session["user"] = result.get("id_token_claims")
            _save_cache(cache)
        except ValueError:  # Usually caused by CSRF
            pass  # Simply ignore them
        return redirect(url_for("index"))

    @app.route("/api/logout")
    def logout():
        session.clear()  # Wipe out user and its token cache from session
        return redirect(  # Also logout from your tenant's web session
            app_config.AUTHORITY + "/oauth2/v2.0/logout" +
            "?post_logout_redirect_uri=" + url_for("index", _external=True))

    @app.route("/graphcall")
    def graphcall():
        token = _get_token_from_cache(app_config.SCOPE)
        if not token:
            return redirect(url_for("login"))
        graph_data = requests.get(  # Use token to call downstream service
            app_config.ENDPOINT,
            headers={'Authorization': 'Bearer ' + token['access_token']},
            ).json()
        return render_template('display.html', result=graph_data) # we should change this to point to the front-end
    
    @cross_origin(supports_credentials=True)
    @app.route("/api/getusertype")
    def getusertype():
        if not session.get("user"):
            return jsonify({"error": "not logged in"}), 401, {'Access-Control-Allow-Credentials': 'true'}

        response = {"userType": session["user"]["roles"][0]}
        return jsonify(response), 200, {'Access-Control-Allow-Credentials': 'true'}
    
    @cross_origin(supports_credentials=True)
    @app.route("/api/getuseremail")
    def getuseremail():
        if not session.get("user"):
            return jsonify({"error": "not logged in"}), 401, {'Access-Control-Allow-Credentials': 'true'}
        print(session["user"]["preferred_username"])
        response = {"userEmail": session["user"]["preferred_username"]}
        return jsonify(response), 200, {'Access-Control-Allow-Credentials': 'true'}
    
    @cross_origin(supports_credentials=True)
    @app.route("/api/getusername")
    def getusername():
        if not session.get("user"):
            return jsonify({"error": "not logged in"}), 401, {'Access-Control-Allow-Credentials': 'true'}

        response = {"username": session["user"]["name"]}
        return jsonify(response), 200, {'Access-Control-Allow-Credentials': 'true'}
    
    @cross_origin(supports_credentials=True)
    @app.route("/api/checksession")
    def checksession():
        if not session.get("user"):
            return jsonify({"error": "not logged in"}), 401, {'Access-Control-Allow-Credentials': 'true'}

        response = {"message": "user is logged in successfully"}
        return jsonify(response), 200, {'Access-Control-Allow-Credentials': 'true'}


    def _load_cache():
        cache = msal.SerializableTokenCache()
        if session.get("token_cache"):
            cache.deserialize(session["token_cache"])
        return cache

    def _save_cache(cache):
        if cache.has_state_changed:
            session["token_cache"] = cache.serialize()

    def _build_msal_app(cache=None, authority=None):
        return msal.ConfidentialClientApplication(
            app_config.CLIENT_ID, authority=authority or app_config.AUTHORITY,
            client_credential=app_config.CLIENT_SECRET, token_cache=cache)

    def _build_auth_code_flow(authority=None, scopes=None):
        return _build_msal_app(authority=authority).initiate_auth_code_flow(
            scopes or [],
            redirect_uri=url_for("authorized", _external=True))

    def _get_token_from_cache(scope=None):
        cache = _load_cache()  # This web app maintains one cache per session
        cca = _build_msal_app(cache=cache)
        accounts = cca.get_accounts()
        if accounts:  # So all account(s) belong to the current signed-in user
            result = cca.acquire_token_silent(scope, account=accounts[0])
            _save_cache(cache)
            return result

    app.jinja_env.globals.update(_build_auth_code_flow=_build_auth_code_flow)  # Used in template
