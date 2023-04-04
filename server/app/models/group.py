from .__init__ import db
from bson import ObjectId
from app.utils.data_conversion import clean_up_json_data
from app.models.student import *
import pandas as pd


groupCollection = db["groups"]

def get_all_groups():
    groupCollection = []
    for document in groupCollection.find():
        document["_id"] = str(document["_id"])
        groupCollection.append(document)
    return groupCollection

def add_group(group_obj):
    result = groupCollection.insert_one(group_obj)
    return result


def add_student_to_group(student_obj):
    result = groupCollection.insert_one(student_obj)
    return result

def add_import_student(student_obj):
    studentsCollection.insert_one(student_obj)
   
# def retrieve_groups_for_project():
#     results = groupCollection.find({"flask": flask_variable})
# def get_student_by_id(id):
#     document = studentsCollection.find_one({"_id": ObjectId(id)})
#     document["_id"] = str(document["_id"])
#     return document

# def update_student_by_id(id, student_obj):
#     result = studentsCollection.replace_one({"_id": ObjectId(id)}, student_obj)
#     return result

# def delete_student_by_id(id):
#     result = studentsCollection.delete_one({"_id": ObjectId(id)})
#     return result

