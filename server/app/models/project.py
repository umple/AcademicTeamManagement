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
    result = projectCollection.find_one({"_id": ObjectId(id)}, {"_id": 0})
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

    application = {
        'project': project_obj.get('project', ''),
        'description': project_obj.get('description', ''),
        'client': project_obj.get('client', ''),
        'status': project_obj.get('status', 'new'),
        'interested groups': [],
        'group': project_obj.get('group', ''),
        'visibility': project_obj.get('visibility', ''),
        'notes': project_obj.get('notes', '')
    }
    result = projectCollection.insert_one(application)
    return result


def update_project_by_id(id, project_obj):
    result = projectCollection.replace_one({"_id": ObjectId(id)}, project_obj)
    return result


def delete_project_by_id(id):
    result = projectCollection.delete_one({"_id": ObjectId(id)})
    return result

def add_group_to_project(group_obj):
    result1 = projectCollection.update_one(
            {"_id": ObjectId(group_obj["project_id"])},
            {"$set": {"group": ObjectId(group_obj["group_id"])}}
        )
    return result1
 
def add_interested_group_to_project(project_id,student_group):
    result = projectCollection.update_one(
            {"_id": ObjectId(project_id)},
            {"$push": {"interested groups": student_group['group_id']}}
        ) 
    return result