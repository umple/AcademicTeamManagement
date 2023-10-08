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


def get_project_not_applied_to():
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
    interested_groups_for_project = []
    project_groups = {}

    for document in projectCollection.find():
        interested_groups_for_project = []
        document['_id'] = str(document['_id'])
        for g in document["interested groups"]:
            interested_groups_for_project.append(
                group.get_group_by_group_name(g))
        project_groups[document['_id']] = interested_groups_for_project
    return project_groups


def add_project(project_obj):
    try:
        if not project_obj.status:
            project_obj.status = 'new'
        result = projectCollection.insert_one(project_obj.to_json())
        return result
    except Exception as e:
        print(f"Error adding project: {e}")
        return None

def update_project_by_id(id, updated_fields):
    updated_fields.pop("_id", None)

    result = projectCollection.update_one(
        {"_id": ObjectId(id)},
        {"$set": updated_fields}
    )
    
    return result


def delete_project_by_id(id):
    project_to_delete = get_project(id)
    group.remove_project_from_group(project_to_delete["project"])
    result = projectCollection.delete_one({"_id": ObjectId(id)})
    return result

def get_project_by_name(name):
    result = projectCollection.find_one({"project": name})
    if result:
        return result
    else:
        return None

def add_group_to_project(projectName, group_id):
    project = get_project_by_name(projectName)
    if project["status"] == "assigned":
        return False
    result1 = projectCollection.update_one(
            {"project": projectName},
            {"$set": {"group": group_id}}
        )
    return result1

def change_status(projectName, status):
    result = projectCollection.update_one(
            {"project": projectName},
            {"$set": {"status": status}}
        )
    return result

def add_interested_group_to_project(project_name, group_id):
    result = projectCollection.update_one(
            {"project": project_name},
            {"$push": {"interested groups": group_id}}
        ) 
    return result