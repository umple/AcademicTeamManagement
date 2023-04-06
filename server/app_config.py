from app.utils.decryption_manager import getDecryptedSecret

CLIENT_ID = getDecryptedSecret("CLIENT_ID") # Application (client) ID of app registration

CLIENT_SECRET = getDecryptedSecret("CLIENT_SECRET") # Placeholder - for use ONLY during testing.

AUTHORITY = getDecryptedSecret("AUTHORITY")  # For multi-tenant app

REDIRECT_PATH = "/getAToken"  # Used for forming an absolute URL to the redirect URI.

ENDPOINT = 'https://graph.microsoft.com/v1.0/users'  # This resource requires no admin consent

SCOPE = ["User.ReadBasic.All"] # permission names for the application

SESSION_TYPE = "filesystem"  # Specifies the token cache should be stored in server-side session
