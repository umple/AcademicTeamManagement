from .__init__ import db
from bson import ObjectId
from app.utils.data_conversion import clean_up_json_data
import app.models.student as student
import pandas as pd
import json

groupCollection = db["groups"]

def get_all_groups():
    group_Collection = []
    for document in groupCollection.find():
        document["_id"] = str(document["_id"])
        group_Collection.append(document)
    return group_Collection

def add_group(group_obj):
    result = groupCollection.insert_one(group_obj)
    return result

def get_group(id):
    result = groupCollection.find_one({"_id": ObjectId(id)})
    if result:
        return result
    else:
        return None
 
    
def add_student_to_group(student_email, group_id):
    student_obj = student.get_student_by_email(student_email)
    group = groupCollection.find_one({"_id": ObjectId(group_id)})
    if student_obj['firstname'] + ' ' + student_obj['lastname'] in group['members']:
        return False
    
    result = groupCollection.update_one(
        {"_id": ObjectId(group_id)},
        {"$push": {"members": str(student_obj['firstname'] + ' ' + student_obj['lastname'])}}
    )
    if result.modified_count > 0:
        return True
    return False



 
def get_user_group(user_name):
    group_collection = groupCollection.find_one({"members": user_name})
    if group_collection:
        # Convert the ObjectId to a string
        group_collection["_id"] = str(group_collection["_id"])
        group_collection_json = json.dumps(group_collection)
        return group_collection_json
    else:
        return None



def add_import_student(student_obj):
    studentsCollection.insert_one(student_obj)

def update_group_by_id(id, project_obj):
    result = groupCollection.replace_one({"_id": ObjectId(id)}, project_obj)
    return json.dumps(result)

def delete_group_by_id(id):
    result = groupCollection.delete_one({"_id": ObjectId(id)})
    return result
