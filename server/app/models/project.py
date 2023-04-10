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
        project_groups[document['project']] = interested_groups_for_project
    return project_groups
     

def add_project(project_obj):
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


def request_project_application(project_id, student_name):
    try:
        student_group = json.loads(group.get_user_group(student_name))
        project = get_project(project_id)
        if (project_application.has_project_application(project_id, student_name)):
            return Exception(f"Application already Submitted {project_id}.") , 400
         
        result = projectCollection.update_one(
            {"_id": ObjectId(project_id)},
            {"$push": {"interested groups": student_group['group_id']}}
        )   

        if result.modified_count > 0 or result.matched_count > 0:
            applications = project_application.create_application(
                project['project'], student_group['group_id'])
        else:
            raise Exception(f"Could not update project {project_id}.")
        return result, 200
    except Exception as e:
        return e, 400
