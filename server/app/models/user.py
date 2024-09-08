from .__init__ import db
from security import azure
import os
from bson import ObjectId

usersCollection = db.users

def get_all_users():
    user_list = []

    for document in usersCollection.find():
        document["_id"] = str(document["_id"])
        user_list.append(document)
    return user_list

def add_user(user_obj):
    try:
        if os.getenv('ENV') != 'DEV': # do not create users in Azure if it's a dev ENV
            azure.add_user_to_azure(user_obj.to_json())
        
        result = usersCollection.insert_one(user_obj.to_json())
        return result
    except Exception as e:
        print(f"Error adding user: {e}")
        return None

def get_user_by_id(a):
    document = usersCollection.find_one({"_id": ObjectId(a)})
    return document

def get_user_by_email(email):
    document = usersCollection.find_one({"email": email})
    if document:
        document["email"] = str(document["email"])
    return document

def update_user_by_id(id, user_obj):
    data = user_obj.to_json()
    del data["_id"]
    result = usersCollection.update_one({"_id": ObjectId(id)}, {
        "$set":data
    })
    return result

def delete_user_by_id(a):
    try:
        user_to_delete = get_user_by_id(a)
        if user_to_delete is not None:
            # Delete the user document
            result = usersCollection.delete_one({"_id": ObjectId(a)})

            if result.deleted_count > 0:
                return "Successfully deleted user"
            else:
                return "No users where deleted"
        else:
            return "User not found"

    except Exception as e:
        raise e