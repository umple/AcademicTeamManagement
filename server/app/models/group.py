from .__init__ import db
from flask import redirect, url_for
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
def get_group_by_group_name(name):
    result = groupCollection.find_one({"group_id": str(name)},  {"_id": 0})
    if result:
        return result
    else:
        return None
    
def add_student_to_group(student_email, group):
    student_obj = student.get_student_by_email(student_email)
    student_name =  student_obj['firstname'] + ' ' + student_obj['lastname']
     
    if student_name in group['members']:
        return False
    
    result = groupCollection.update_one(
        {"_id": ObjectId(group["_id"])},
        {"$push": {"members": str(student_name)}}
    )
    if result.modified_count > 0:
        return True
    return False


def remove_student_from_group(student_name):
    student_group = json.loads(get_user_group(student_name))
    if student_name not in student_group['members']:
        return False

    result = groupCollection.update_one(
        {"_id": ObjectId(student_group['_id'])},
        {"$pull": {"members": student_name}}
    )
    if result.modified_count > 0:
        return True
    return False
 
def get_user_group(user_name):
    group_collection = groupCollection.find_one({"members": user_name})
    if group_collection:
        group_collection["_id"] = str(group_collection["_id"])
        group_collection_json = json.dumps(group_collection)
        return group_collection_json
    else:
        return None
    
def is_user_in_group(user_name):
    group_collection = groupCollection.find_one({"members": user_name})
    if group_collection:
        return True
    else:
        return False

def update_group_by_id(id, project_obj):
    result = groupCollection.replace_one({"_id": ObjectId(id)}, project_obj)
    return json.dumps(result)

def delete_group_by_id(id):
    result = groupCollection.delete_one({"_id": ObjectId(id)})
    return result
