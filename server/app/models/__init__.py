import os
from pymongo import MongoClient
import mongomock

# Check if the MONGO env port exists, otherwise use 27017 by default
PORT = int(os.getenv("MONGO")) if os.getenv("MONGO") else 27017

# Initialize clients
client = None
db = None

# Check if a testing environment is running
if os.getenv('ENVIRONMENT') == 'TESTING':
    # Create a testing database
    print("In a Test Environment")
    client = mongomock.MongoClient()
    db = client.db
else:
    client = MongoClient(
        host=os.getenv("MONGODB_HOST"),
        port=PORT,
        username=os.getenv("MONGODB_INITDB_ROOT_USERNAME"),
        password=os.getenv("MONGODB_INITDB_ROOT_PASSWORD"),
        authSource="AcademicTeamManagementDB"
    )   
    # Main database
    db = client["AcademicTeamManagementDB"]
