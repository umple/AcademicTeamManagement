from .__init__ import db
from bson import ObjectId
from flask import session
from app.models import group, project_application
import json

projectCollection = db["projects"]


def get_all_projects():
    project_list = []
    for document in projectCollection.find():
        document["_id"] = str(document["_id"])
        project_list.append(document)
    return project_list


def get_project(id):
    result = projectCollection.find_one({"_id": ObjectId(id)}, {"_id":0})
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
    print(interested_groups)
    return interested_groups


def add_project(project_obj):
    
    result = projectCollection.insert_one(project_obj)
    projectCollection.update_one(
        {"_id" : result['_id']},
        {"$set": {"interested groups": []}}
    )
    return result

def update_project_by_id(id, project_obj):
    result = projectCollection.replace_one({"_id": ObjectId(id)}, project_obj)
    return result

def delete_project_by_id(id):
    result = projectCollection.delete_one({"_id": ObjectId(id)})
    return result

def request_project_application(project_id, student_name):
    try:
        student_group = json.loads(group.get_user_group(student_name))
        project = get_project(project_id)
    
        result = projectCollection.update_one(
            {"_id": ObjectId(project_id)},
            {"$addToSet": {"interested groups": {"$each": [student_group['group_id']]}}}
        )
        
        if result.modified_count > 0 or result.matched_count > 0:
            applications = project_application.create_application(project['project'],student_group['group_id'])
        else:
            raise Exception(f"Could not update project {project_id}.")
        return result
    except Exception as e:
        return e, 408
