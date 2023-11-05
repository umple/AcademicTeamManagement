from .__init__ import db
from bson import ObjectId

usersCollection = db["users"]

def get_all_users():
    user_list = []
    for document in usersCollection.find():
        document["_id"] = str(document["_id"])
        user_list.append(document)
    return user_list

def add_user(user_obj):
    try:
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
    document["email"] = str(document["email"])
    return document

def update_user_by_id(id, user_obj):
    result = usersCollection.update_one({"_id": ObjectId(id)}, {
        "$set":user_obj.to_json()
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