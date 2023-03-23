import os
from pymongo import MongoClient

client = MongoClient(
    host=os.getenv("MONGODB_HOST"),
    port=int(os.getenv("MONGO")),
    username=os.getenv("MONGODB_INITDB_ROOT_USERNAME"),
    password=os.getenv("MONGODB_INITDB_ROOT_PASSWORD"),
    authSource="admin"
)

db = client["AcademicTeamManagementDB"]
