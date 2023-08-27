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
    if project_obj.get('status') == '':
        project_obj['status'] = 'new'

    project = {
        'project': project_obj.get('project', ''),
        'description': project_obj.get('description', ''),
        'clientName': project_obj.get('clientName', ''),
        'clientEmail': project_obj.get('clientEmail', ''),
        'status': project_obj.get('status', 'new'),
        'interested groups': [],
        'group': project_obj.get('group', ''),
        'visibility': project_obj.get('visibility', ''),
        'notes': project_obj.get('notes', '')
    }
    result = projectCollection.insert_one(project)
    return result


def update_project_by_id(id, project_obj):
    result = projectCollection.replace_one({"_id": ObjectId(id)}, project_obj)
    return result


def delete_project_by_id(id):
    project_to_delete = get_project(id)
    group.remove_project_from_group(project_to_delete["project"])
    result = projectCollection.delete_one({"_id": ObjectId(id)})
    return result

def add_group_to_project(group_obj):
    result1 = projectCollection.update_one(
            {"_id": ObjectId(group_obj["project_id"])},
            {"$set": {"group": ObjectId(group_obj["group_id"])}}
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