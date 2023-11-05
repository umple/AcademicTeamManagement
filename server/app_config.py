from datetime import timedelta
from app.utils.decryption_manager import getDecryptedSecret

TENANT_ID  = '5ee1d726-eaf0-4d71-bcf8-666152bb7058'

CLIENT_ID = getDecryptedSecret("CLIENT_ID") # Application (client) ID of app registration

CLIENT_SECRET = getDecryptedSecret("CLIENT_SECRET") # Placeholder - for use ONLY during testing.

AUTHORITY = getDecryptedSecret("AUTHORITY")  # For multi-tenant app

REDIRECT_PATH = "/api/getAToken"  # Used for forming an absolute URL to the redirect URI.

ENDPOINT = 'https://graph.microsoft.com/v1.0/users'  # This resource requires no admin consent

SCOPE = ["User.ReadBasic.All"] # permission names for the application

SESSION_TYPE = "filesystem"  # Specifies the token cache should be stored in server-side session

CORS_HEADERS = 'Content-Type' # Set CORS

SECRET_KEY = 'ee068ec2-179b-46ca-92d1-0e3e8f138ac5' # Secret Key to uinquly identify the app

PERMANENT_SESSION_LIFETIME = timedelta(hours=5) # Set lifetime of the session to 5 hours

SESSION_COOKIE_SAMESITE="None" # Don't require using the same site

SESSION_COOKIE_SECURE=True # Secure the cookies