from .__init__ import db
from bson import ObjectId
from app.utils.data_conversion import clean_up_json_data
from app.models.student import *
import pandas as pd


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


def add_student_to_group(student_obj):
    result = groupCollection.insert_one(student_obj)
    return result

def add_import_student(student_obj):
    studentsCollection.insert_one(student_obj)

def update_group_by_id(id, project_obj):
    result = groupCollection.replace_one({"_id": ObjectId(id)}, project_obj)
    return result

def delete_group_by_id(id):
    result = groupCollection.delete_one({"_id": ObjectId(id)})
    return result
