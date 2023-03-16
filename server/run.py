import os
from flask import Flask, redirect, request, session
from flask_restful import Api
from flask_cors import CORS
from main import initialize_routes
from requests_oauthlib import OAuth2Session
from uuid import uuid4
from app.controllers import student_controller
from app.utils.decryption_manager import getDecryptedSecret

app = Flask(__name__)
app.config["SECRET_KEY"] = str(uuid4())
api = Api(app)
CORS(app, resources={r"*": {"origins": "*"}})

initialize_routes(app, api)

AUTHORITY = getDecryptedSecret("AUTHORITY")
CLIENT_ID = getDecryptedSecret("CLIENT_ID")
CLIENT_SECRET = getDecryptedSecret("CLIENT_SECRET")
REDIRECT_URI = "http://localhost:%s"%os.getenv("REACT")

oauth = OAuth2Session(CLIENT_ID, redirect_uri=REDIRECT_URI, scope=["openid", "profile"])

@app.route("/api/login", methods=['POST','GET'])
def login():
    authorization_url, state = oauth.authorization_url(f"{AUTHORITY}/oauth2/v2.0/authorize")
    session["state"] = state
    return redirect(authorization_url)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=os.getenv("FLASK"))
