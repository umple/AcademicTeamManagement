from .__init__ import db
from bson import ObjectId
from flask import session
from app.models import group
import json

projectCollection = db["projects"]


def get_all_projects():
    project_list = []
    for document in projectCollection.find():
        document["_id"] = str(document["_id"])
        project_list.append(document)
    return project_list


def get_project(id):
    result = projectCollection.find_one({"_id": ObjectId(id)})
    if result:
        return result
    else:
        return None

def get_interested_groups():
    interested_groups = []
    for document in projectCollection.find():
        document['_id'] = str(document['_id'])
        for g in document["interested groups"]:
            interested_groups.append(group.get_group_by_name(g))
    return interested_groups


def add_project(project_obj):
    result = projectCollection.insert_one(project_obj)
    return result

def update_project_by_id(id, project_obj):
    result = projectCollection.replace_one({"_id": ObjectId(id)}, project_obj)
    return result

def delete_project_by_id(id):
    result = projectCollection.delete_one({"_id": ObjectId(id)})
    return result

def request_to_join_project(project_id, student_name):
    try:
        student_group = json.loads(group.get_user_group(student_name))
        result = projectCollection.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": {"interested groups": []}}
        )
        if result.modified_count > 0 or result.matched_count > 0:
            result = projectCollection.update_one(
                {"_id": ObjectId(project_id)},
                {"$addToSet": {"interested groups": {"$each": [student_group['group_id']]}}}
            )
        else:
            raise Exception(f"Could not update project {project_id}.")
        return result
    except Exception as e:
        print(f"An error occurred while updating project {project_id}: {e}")
        return None
