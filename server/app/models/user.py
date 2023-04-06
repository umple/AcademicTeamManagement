from .__init__ import db
from bson import ObjectId

userCollection = db["user"]

def add_user(user_obj):
    result = userCollection.insert_one(user_obj)
    return result