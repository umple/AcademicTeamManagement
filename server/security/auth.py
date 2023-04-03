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

    def obtain_accesstoken(self, TENANT_NAME, CLIENT_ID, CLIENT_SECRET, resource):
        """
        This function is used to get an access token to MS Graph.

        :param TENANT_NAME: The name of the Azure tenant
        :param CLIENT_ID: The ID of the registered Azure AD application
        :param CLIENT_SECRET: Secret of the registered Azure AD application
        :param resource: The resource to get an access token for
        :return: The access token
        """
        auth_context = adal.AuthenticationContext('https://login.microsoftonline.com/' + TENANT_NAME)
        token = auth_context.acquire_token_with_client_credentials(
            resource=resource, client_id=CLIENT_ID,
            client_secret=CLIENT_SECRET)
        return token

    def get_access_token_from_azure_ad(self):
        RESOURCE = "https://graph.microsoft.com"
        TENANT_NAME = "AcademicTeamManagement"
        #token = context.acquire_token_with_client_credentials(TENANT_NAME, self.CLIENT_ID, self.CLIENT_SECRET, RESOURCE)
        token = self.obtain_accesstoken(TENANT_NAME, self.CLIENT_ID, self.CLIENT_SECRET, RESOURCE)
        print("--------Access Token---------")
        print(token)
        return token.get("accessToken")
    
    def get_user_id_from_azure_ad(self):
        token2 =  self.get_access_token_from_azure_ad()
        token = "eyJ0eXAiOiJKV1QiLCJub25jZSI6IlptZWdJT1Z2LTBmWlBQcERaaEx6cWo3UURhbElJRllmODI0QkxKbEE4UGMiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9kNDFmZGFiMS03ZTE1LTRjZmQtYjVmYS03MjAwZTU0ZGViNmIvIiwiaWF0IjoxNjgwNTU1MTIxLCJuYmYiOjE2ODA1NTUxMjEsImV4cCI6MTY4MDY0MTgyMSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFYUUFpLzhUQUFBQUpMa1NDM3ZTeWtKeTBHclROV2cvQ1hJb1NGMGJ0Z01DTEhUMWlmaUNobWcra0NVSmVLUk5qc2hKSkh1NFA3NEJ6c1dCelR4S0ZvcUorT1gyVTU4NUpTZC8rN1JUVFczZmhDQ056dEJjeTJBV3BjNFNpUjlUYTdvb2tQUVAwenp5WTYyWU5oZjNvQVBoQ1haeStQbmVhZz09IiwiYW1yIjpbInB3ZCIsIm1mYSJdLCJhcHBfZGlzcGxheW5hbWUiOiJHcmFwaCBFeHBsb3JlciIsImFwcGlkIjoiZGU4YmM4YjUtZDlmOS00OGIxLWE4YWQtYjc0OGRhNzI1MDY0IiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJHcmlyYSIsImdpdmVuX25hbWUiOiJMYWl0aCIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjEzNy4xMjIuNjQuMjA2IiwibmFtZSI6IkxhaXRoIEdyaXJhIiwib2lkIjoiOWM4M2FmYzMtOWU1NS00M2RkLThlMzktNjM2NjI4ZDMzYWQ0Iiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTI4MTM2MDM5MTUtMTQ5Nzk1OTU3Ny0xMDE1NzE3MzExLTEwMjk2NTIiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzIwMDAzNzU1MDI1MyIsInJoIjoiMC5BWFlBc2RvZjFCVi1fVXkxLW5JQTVVM3Jhd01BQUFBQUFBQUF3QUFBQUFBQUFBQjJBQkUuIiwic2NwIjoiQVBJQ29ubmVjdG9ycy5SZWFkLkFsbCBBUElDb25uZWN0b3JzLlJlYWRXcml0ZS5BbGwgQ2FsZW5kYXJzLlJlYWRXcml0ZSBDb250YWN0cy5SZWFkV3JpdGUgRGV2aWNlLkNvbW1hbmQgRGV2aWNlLlJlYWQgRGV2aWNlLlJlYWQuQWxsIERldmljZUxvY2FsQ3JlZGVudGlhbC5SZWFkLkFsbCBEZXZpY2VNYW5hZ2VtZW50QXBwcy5SZWFkLkFsbCBEZXZpY2VNYW5hZ2VtZW50QXBwcy5SZWFkV3JpdGUuQWxsIERldmljZU1hbmFnZW1lbnRDb25maWd1cmF0aW9uLlJlYWQuQWxsIERldmljZU1hbmFnZW1lbnRDb25maWd1cmF0aW9uLlJlYWRXcml0ZS5BbGwgRGV2aWNlTWFuYWdlbWVudE1hbmFnZWREZXZpY2VzLlByaXZpbGVnZWRPcGVyYXRpb25zLkFsbCBEZXZpY2VNYW5hZ2VtZW50TWFuYWdlZERldmljZXMuUmVhZC5BbGwgRGV2aWNlTWFuYWdlbWVudE1hbmFnZWREZXZpY2VzLlJlYWRXcml0ZS5BbGwgRGV2aWNlTWFuYWdlbWVudFJCQUMuUmVhZC5BbGwgRGV2aWNlTWFuYWdlbWVudFJCQUMuUmVhZFdyaXRlLkFsbCBEZXZpY2VNYW5hZ2VtZW50U2VydmljZUNvbmZpZy5SZWFkLkFsbCBEZXZpY2VNYW5hZ2VtZW50U2VydmljZUNvbmZpZy5SZWFkV3JpdGUuQWxsIERpcmVjdG9yeS5SZWFkLkFsbCBGaWxlcy5SZWFkV3JpdGUuQWxsIEdyb3VwLlJlYWQuQWxsIE1haWwuUmVhZFdyaXRlIE5vdGVzLlJlYWRXcml0ZS5BbGwgb3BlbmlkIFBlb3BsZS5SZWFkIFBlb3BsZS5SZWFkLkFsbCBQb2xpY3kuUmVhZC5BbGwgUG9saWN5LlJlYWRXcml0ZS5EZXZpY2VDb25maWd1cmF0aW9uIHByb2ZpbGUgU2l0ZXMuUmVhZFdyaXRlLkFsbCBUYXNrcy5SZWFkV3JpdGUgVXNlci5SZWFkIFVzZXIuUmVhZC5BbGwgVXNlci5SZWFkQmFzaWMuQWxsIFVzZXIuUmVhZFdyaXRlIGVtYWlsIiwic2lnbmluX3N0YXRlIjpbImttc2kiXSwic3ViIjoicDZYb2ZIRWRNYTlKa3dRZWFOVmNEQWZFZVZvUWV6Z0pCUFJtTGlYMk5uMCIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJOQSIsInRpZCI6ImQ0MWZkYWIxLTdlMTUtNGNmZC1iNWZhLTcyMDBlNTRkZWI2YiIsInVuaXF1ZV9uYW1lIjoibGdyaXIwNTdAdW90dGF3YS5jYSIsInVwbiI6ImxncmlyMDU3QHVvdHRhd2EuY2EiLCJ1dGkiOiJUNlZZSVdiUjFrSzEwMnVkbG9hUEFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX2NjIjpbIkNQMSJdLCJ4bXNfc3NtIjoiMSIsInhtc19zdCI6eyJzdWIiOiJoRERDLW9SVkZyZmdwQkxhNGJuTDhmWDd0M2UxWnMzd2ttZFlhZk54T0xNIn0sInhtc190Y2R0IjoxNTAwMTYzNzg2fQ.KzciNuzrFYjK8-DSfwmN7QEEywTsL6MPxNaT-ylfU29vrVNyM0Mlx4Rz82-GZ-6DKFFtelVlZxkYLZPYo7n7oftjNtzejyi5qEPU56fpqnWDLwluCVBIUnDUl7i6nSRxYCqJpmOAYpjMlamFdqfGtWiBlBP5ib-oy5iWw1xiHbr32pu2RbAYeEvfThBq9BKJ_tC0ta5_hg-7HRM2r7Bp82yAt2QinWPsYtJ5U52N77gJtmqM50zXA-mw9hOeg1G5FSxeVJ5z0tUnwdSDLKNeakbt7QQJvRjxU32QbCRlSRczDgvKtK6qb7Hb2poFuQA68Swn2XibZceODKXQoGlOiw"
        headers = {
            "Authorization": token,
            "Content-Type": "application/json"
        }
        response = requests.get("https://graph.microsoft.com/v1.0/me", headers=headers)
        #print(token2)
        print(response.json()) # the response here is returing 400

        if response.status_code == 200:
            data = response.json()
            return data["id"]
        else:
            return None

    def get_user_role_from_azure_ad(self):
        #token = self.get_access_token_from_azure_ad()  # Replace with your code to get access token
        token = "eyJ0eXAiOiJKV1QiLCJub25jZSI6IlptZWdJT1Z2LTBmWlBQcERaaEx6cWo3UURhbElJRllmODI0QkxKbEE4UGMiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9kNDFmZGFiMS03ZTE1LTRjZmQtYjVmYS03MjAwZTU0ZGViNmIvIiwiaWF0IjoxNjgwNTU1MTIxLCJuYmYiOjE2ODA1NTUxMjEsImV4cCI6MTY4MDY0MTgyMSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFYUUFpLzhUQUFBQUpMa1NDM3ZTeWtKeTBHclROV2cvQ1hJb1NGMGJ0Z01DTEhUMWlmaUNobWcra0NVSmVLUk5qc2hKSkh1NFA3NEJ6c1dCelR4S0ZvcUorT1gyVTU4NUpTZC8rN1JUVFczZmhDQ056dEJjeTJBV3BjNFNpUjlUYTdvb2tQUVAwenp5WTYyWU5oZjNvQVBoQ1haeStQbmVhZz09IiwiYW1yIjpbInB3ZCIsIm1mYSJdLCJhcHBfZGlzcGxheW5hbWUiOiJHcmFwaCBFeHBsb3JlciIsImFwcGlkIjoiZGU4YmM4YjUtZDlmOS00OGIxLWE4YWQtYjc0OGRhNzI1MDY0IiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJHcmlyYSIsImdpdmVuX25hbWUiOiJMYWl0aCIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjEzNy4xMjIuNjQuMjA2IiwibmFtZSI6IkxhaXRoIEdyaXJhIiwib2lkIjoiOWM4M2FmYzMtOWU1NS00M2RkLThlMzktNjM2NjI4ZDMzYWQ0Iiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTI4MTM2MDM5MTUtMTQ5Nzk1OTU3Ny0xMDE1NzE3MzExLTEwMjk2NTIiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzIwMDAzNzU1MDI1MyIsInJoIjoiMC5BWFlBc2RvZjFCVi1fVXkxLW5JQTVVM3Jhd01BQUFBQUFBQUF3QUFBQUFBQUFBQjJBQkUuIiwic2NwIjoiQVBJQ29ubmVjdG9ycy5SZWFkLkFsbCBBUElDb25uZWN0b3JzLlJlYWRXcml0ZS5BbGwgQ2FsZW5kYXJzLlJlYWRXcml0ZSBDb250YWN0cy5SZWFkV3JpdGUgRGV2aWNlLkNvbW1hbmQgRGV2aWNlLlJlYWQgRGV2aWNlLlJlYWQuQWxsIERldmljZUxvY2FsQ3JlZGVudGlhbC5SZWFkLkFsbCBEZXZpY2VNYW5hZ2VtZW50QXBwcy5SZWFkLkFsbCBEZXZpY2VNYW5hZ2VtZW50QXBwcy5SZWFkV3JpdGUuQWxsIERldmljZU1hbmFnZW1lbnRDb25maWd1cmF0aW9uLlJlYWQuQWxsIERldmljZU1hbmFnZW1lbnRDb25maWd1cmF0aW9uLlJlYWRXcml0ZS5BbGwgRGV2aWNlTWFuYWdlbWVudE1hbmFnZWREZXZpY2VzLlByaXZpbGVnZWRPcGVyYXRpb25zLkFsbCBEZXZpY2VNYW5hZ2VtZW50TWFuYWdlZERldmljZXMuUmVhZC5BbGwgRGV2aWNlTWFuYWdlbWVudE1hbmFnZWREZXZpY2VzLlJlYWRXcml0ZS5BbGwgRGV2aWNlTWFuYWdlbWVudFJCQUMuUmVhZC5BbGwgRGV2aWNlTWFuYWdlbWVudFJCQUMuUmVhZFdyaXRlLkFsbCBEZXZpY2VNYW5hZ2VtZW50U2VydmljZUNvbmZpZy5SZWFkLkFsbCBEZXZpY2VNYW5hZ2VtZW50U2VydmljZUNvbmZpZy5SZWFkV3JpdGUuQWxsIERpcmVjdG9yeS5SZWFkLkFsbCBGaWxlcy5SZWFkV3JpdGUuQWxsIEdyb3VwLlJlYWQuQWxsIE1haWwuUmVhZFdyaXRlIE5vdGVzLlJlYWRXcml0ZS5BbGwgb3BlbmlkIFBlb3BsZS5SZWFkIFBlb3BsZS5SZWFkLkFsbCBQb2xpY3kuUmVhZC5BbGwgUG9saWN5LlJlYWRXcml0ZS5EZXZpY2VDb25maWd1cmF0aW9uIHByb2ZpbGUgU2l0ZXMuUmVhZFdyaXRlLkFsbCBUYXNrcy5SZWFkV3JpdGUgVXNlci5SZWFkIFVzZXIuUmVhZC5BbGwgVXNlci5SZWFkQmFzaWMuQWxsIFVzZXIuUmVhZFdyaXRlIGVtYWlsIiwic2lnbmluX3N0YXRlIjpbImttc2kiXSwic3ViIjoicDZYb2ZIRWRNYTlKa3dRZWFOVmNEQWZFZVZvUWV6Z0pCUFJtTGlYMk5uMCIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJOQSIsInRpZCI6ImQ0MWZkYWIxLTdlMTUtNGNmZC1iNWZhLTcyMDBlNTRkZWI2YiIsInVuaXF1ZV9uYW1lIjoibGdyaXIwNTdAdW90dGF3YS5jYSIsInVwbiI6ImxncmlyMDU3QHVvdHRhd2EuY2EiLCJ1dGkiOiJUNlZZSVdiUjFrSzEwMnVkbG9hUEFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX2NjIjpbIkNQMSJdLCJ4bXNfc3NtIjoiMSIsInhtc19zdCI6eyJzdWIiOiJoRERDLW9SVkZyZmdwQkxhNGJuTDhmWDd0M2UxWnMzd2ttZFlhZk54T0xNIn0sInhtc190Y2R0IjoxNTAwMTYzNzg2fQ.KzciNuzrFYjK8-DSfwmN7QEEywTsL6MPxNaT-ylfU29vrVNyM0Mlx4Rz82-GZ-6DKFFtelVlZxkYLZPYo7n7oftjNtzejyi5qEPU56fpqnWDLwluCVBIUnDUl7i6nSRxYCqJpmOAYpjMlamFdqfGtWiBlBP5ib-oy5iWw1xiHbr32pu2RbAYeEvfThBq9BKJ_tC0ta5_hg-7HRM2r7Bp82yAt2QinWPsYtJ5U52N77gJtmqM50zXA-mw9hOeg1G5FSxeVJ5z0tUnwdSDLKNeakbt7QQJvRjxU32QbCRlSRczDgvKtK6qb7Hb2poFuQA68Swn2XibZceODKXQoGlOiw"
        user_id = self.get_user_id_from_azure_ad()  # Replace with your code to get user ID

        # Construct the URL to retrieve the user's roles
        url = f"https://graph.microsoft.com/v1.0/users/{user_id}/appRoleAssignments?$filter=principalId eq '{user_id}'"

        # Set the headers with the access token
        headers = {
            "Authorization": token,
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
    
    # def get_user_role(self):
    #     access_token = self.get_access_token_from_azure_ad()
    #     headers = {"Authorization": "Bearer " + access_token}
    #     try:
    #         response = requests.get("https://graph.microsoft.com/v1.0/me/memberOf", headers=headers)
    #         response.raise_for_status()
    #         data = response.json()
    #         roles = [group["displayName"] for group in data["value"] if "Security Group" in group["@odata.type"]]
    #         # Here you can write the logic to determine the user's role based on the groups they are a member of.
    #         # For example, if the user is a member of a group called "Admins", return "admin". Otherwise, return "user".
    #         if "Admins" in roles:
    #             return "admin"
    #         else:
    #             return "user"
    #     except HTTPError as http_err:
    #         print(f"HTTP error occurred: {http_err}")
    #     except Exception as err:
    #         print(f"Other error occurred: {err}")


    def get(self):
        role = self.get_user_role_from_azure_ad()  # Replace with code to get user's role
        if role == "admin":
            redirect_uri = "http://localhost:%s/"%os.getenv("REACT")
        else:
            redirect_uri = "http://localhost:%s/"%os.getenv("REACT")
        self.oauth = OAuth2Session(self.CLIENT_ID, redirect_uri=redirect_uri, scope=["openid", "profile"])
        authorization_url, state = self.oauth.authorization_url(f"{self.AUTHORITY}/oauth2/v2.0/authorize")
        session["state"] = state
        return redirect(authorization_url)
        
    # def post(self):
    #     REDIRECT_URI = "http://localhost:%s/"%os.getenv("REACT")
    #     self.oauth = OAuth2Session(self.CLIENT_ID, state=session.get("state"), redirect_uri=REDIRECT_URI)
    #     token = self.oauth.fetch_token(f"{self.AUTHORITY}/oauth2/v2.0/token", client_secret=self.CLIENT_SECRET, authorization_response=request.url)

    #     # Decode the ID token to extract the roles claim
    #     decoded_token = jwt.decode(token['id_token'], verify=False)
    #     roles = decoded_token.get('roles', [])

    #     # Create a new token with the user type included
    #     access_token = create_access_token(identity=token['accessToken'], user_claims={'roles': roles})

    #     session["accessToken"] = access_token
    #     return redirect("/") # Redirect to the homepage or the next page you want to display.e homepage or the next page you want to display.