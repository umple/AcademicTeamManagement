from .__init__ import db
from bson import ObjectId
import json

staffCollection = db["staff"]
usersCollection = db["users"]

def get_all_staff():
    staff_list = []
    for document in staffCollection.find():
        document["_id"] = str(document["_id"])
        staff_list.append(document)
    return staff_list

def add_staff(staff_obj):
    try:
        result = staffCollection.insert_one(staff_obj.to_json())
        return result
    except Exception as e:
        print(f"Error adding staff: {e}")
        return None

def get_staff_by_id(a):
    document = staffCollection.find_one({"_id": ObjectId(a)})
    return document

def get_staff_by_email(email):
    document = staffCollection.find_one({"email": email})

    if document is None:
        return None

    else:
        document["email"] = str(document["email"])
        return document

def update_staff_by_id(id, staff_obj):
    old_staff = staffCollection.find_one({"_id": ObjectId(id)})
    data = staff_obj.to_json()
    del data["_id"]
    result = staffCollection.update_one({"_id": ObjectId(id)}, {
        "$set":data
    })
    # check if the role changed
    if old_staff["role"] != data["role"]:
        # update the user data too
        result = usersCollection.update_one({"_id": ObjectId(id)}, {
            "$set":{
                "role": data["role"]
            }
        })
    return result

def delete_staff_by_id(a):
    try:
        staff_to_delete = get_staff_by_id(a)
        if staff_to_delete is not None:
            # Delete the staff document
            result = staffCollection.delete_one({"_id": ObjectId(a)})

            if result.deleted_count > 0:
                return "Successfully deleted staff"
            else:
                return "No staff where deleted"
        else:
            return "User not found"

    except Exception as e:
        raise e