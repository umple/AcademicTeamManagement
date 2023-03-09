
from flask import Flask, redirect, session
from flask_restful import Resource, reqparse
from requests_oauthlib import OAuth2Session
import os
from app.utils.decryption_manager import getDecryptedSecret

class AuthenticationAPI(Resource):
    REDIRECT_URI = "http://localhost:%s"%os.getenv("REACT")
    def __init__(self):
        self.AUTHORITY = getDecryptedSecret("AUTHORITY")
        self.CLIENT_ID = getDecryptedSecret("CLIENT_ID")
        self.CLIENT_SECRET = getDecryptedSecret("CLIENT_SECRET")
        super(AuthenticationAPI, self).__init__()

    def get(self):
        self.oauth = OAuth2Session(self.CLIENT_ID, redirect_uri= self.REDIRECT_URI, scope=["openid", "profile"])
        authorization_url, state = self.oauth.authorization_url(f"{self.AUTHORITY}/oauth2/v2.0/authorize")
        session["state"] = state
        return redirect(authorization_url)
