import os
from pymongo import MongoClient

# Check if the MONGO env port exists, otherwise use 27017 by default
PORT = int(os.getenv("MONGO")) if os.getenv("MONGO") else 27017

client = MongoClient(
        host=os.getenv("MONGODB_HOST"),
        port=PORT,
        username=os.getenv("MONGODB_INITDB_ROOT_USERNAME"),
        password=os.getenv("MONGODB_INITDB_ROOT_PASSWORD"),
        authSource="AcademicTeamManagementDB"
)

# Check if a testing environment is running
if os.environ.get('ENVIRONMENT') == 'TESTING':
    # Create a testing database
    db = client["TestAcademicTeamManagementDB"]
else:
    # Main database
    db = client["AcademicTeamManagementDB"]
