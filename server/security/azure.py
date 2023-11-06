import requests
import json
from app_config import CLIENT_ID, CLIENT_SECRET, TENANT_ID

# Azure AD token endpoint
token_url = f'https://login.microsoftonline.com/{TENANT_ID}/oauth2/token'

# Define the token request data
token_data = {
    'grant_type': 'client_credentials',
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
    'resource': 'https://graph.microsoft.com'
}

def add_user_to_azure(user_obj):
    # get user email
    email = user_obj.get("email", "")
    
    # Send a POST request to obtain the access token
    token_response = requests.post(token_url, data=token_data)

    # Check if the token was obtained successfully
    if token_response.status_code == 200:
        access_token = token_response.json().get('access_token')
    else:
        print(f"Failed to obtain access token. Status code: {token_response.status_code}")
        print(token_response.text)
        return
    
    # Azure AD endpoint for inviting an external user
    invite_user_endpoint = f'https://graph.microsoft.com/v1.0/{TENANT_ID}/invitations'

    # Define the external user data
    external_user_data = {
        "invitedUserEmailAddress": email,
        "inviteRedirectUrl": "https://yourapp.com/redirect",
        "sendInvitationMessage": True
    }

    # Set headers for the request
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {access_token}'
    }

    # Send a POST request to invite the external user
    response = requests.post(invite_user_endpoint, json=external_user_data, headers=headers)

    if response.status_code == 201:
        print("User created successfully.")

    else:
        print(f"Failed to create user. Status code: {response.status_code}")
        print(response.text)