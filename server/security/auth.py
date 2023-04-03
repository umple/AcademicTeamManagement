from flask_jwt_extended import create_access_token
import jwt
import adal
import requests
from flask import Flask, redirect, session, request
from flask_restful import Resource, reqparse
from requests_oauthlib import OAuth2Session
import os
import json
from requests.exceptions import HTTPError
from app.utils.decryption_manager import getDecryptedSecret

class AuthenticationAPI(Resource):
    def __init__(self):
        self.AUTHORITY = getDecryptedSecret("AUTHORITY")
        self.CLIENT_ID = getDecryptedSecret("CLIENT_ID")
        self.CLIENT_SECRET = getDecryptedSecret("CLIENT_SECRET")
        super(AuthenticationAPI, self).__init__()

    def get_access_token_from_azure_ad(self):
        RESOURCE = "https://graph.microsoft.com"
        context = adal.AuthenticationContext(self.AUTHORITY, api_version=None)
        token = context.acquire_token_with_client_credentials(RESOURCE, self.CLIENT_ID, self.CLIENT_SECRET)
        return token.get("accessToken")
    
    def get_user_id_from_azure_ad(self):
        token =  self.get_access_token_from_azure_ad()
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        response = requests.get("https://graph.microsoft.com/v1.0/me?$select=id", headers=headers)
        print(response.json()) # the response here is returing 400

        if response.status_code == 200:
            data = response.json()
            return data["id"]
        else:
            return None

    def get_user_role_from_azure_ad(self):
        token = self.get_access_token_from_azure_ad()  # Replace with your code to get access token
        user_id = self.get_user_id_from_azure_ad()  # Replace with your code to get user ID

        # Construct the URL to retrieve the user's roles
        url = f"https://graph.microsoft.com/v1.0/users/{user_id}/appRoleAssignments?$filter=principalId eq '{user_id}'"

        # Set the headers with the access token
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        # Make the request to Microsoft Graph API
        response = requests.get(url, headers=headers)

        # Parse the response to retrieve the user's roles
        roles = []
        if response.status_code == 200:
            data = response.json()
            for item in data["value"]:
                roles.append(item["appRoleDefinition"]["displayName"])
        return roles[0] if roles else None
    
    def get_user_role(self):
        access_token = self.get_access_token_from_azure_ad()
        headers = {"Authorization": "Bearer " + access_token}
        try:
            response = requests.get("https://graph.microsoft.com/v1.0/me/memberOf", headers=headers)
            response.raise_for_status()
            data = response.json()
            roles = [group["displayName"] for group in data["value"] if "Security Group" in group["@odata.type"]]
            # Here you can write the logic to determine the user's role based on the groups they are a member of.
            # For example, if the user is a member of a group called "Admins", return "admin". Otherwise, return "user".
            if "Admins" in roles:
                return "admin"
            else:
                return "user"
        except HTTPError as http_err:
            print(f"HTTP error occurred: {http_err}")
        except Exception as err:
            print(f"Other error occurred: {err}")


    def get(self):
        role = self.get_user_role_from_azure_ad()  # Replace with code to get user's role
        if role == "admin":
            redirect_uri = "http://localhost:%s/"%os.getenv("REACT")
        else:
            redirect_uri = "http://localhost:%s/StudentHome"%os.getenv("REACT")
        self.oauth = OAuth2Session(self.CLIENT_ID, redirect_uri=redirect_uri, scope=["openid", "profile"])
        authorization_url, state = self.oauth.authorization_url(f"{self.AUTHORITY}/oauth2/v2.0/authorize")
        session["state"] = state
        return redirect(authorization_url)
        
    def post(self):
        REDIRECT_URI = "http://localhost:%s/"%os.getenv("REACT")
        self.oauth = OAuth2Session(self.CLIENT_ID, state=session.get("state"), redirect_uri=REDIRECT_URI)
        token = self.oauth.fetch_token(f"{self.AUTHORITY}/oauth2/v2.0/token", client_secret=self.CLIENT_SECRET, authorization_response=request.url)

        # Decode the ID token to extract the roles claim
        decoded_token = jwt.decode(token['id_token'], verify=False)
        roles = decoded_token.get('roles', [])

        # Create a new token with the user type included
        access_token = create_access_token(identity=token['accessToken'], user_claims={'roles': roles})

        session["accessToken"] = access_token
        return redirect("/") # Redirect to the homepage or the next page you want to display.