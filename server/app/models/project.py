from .__init__ import db
from bson import ObjectId
from app.models import group, project_application
import json

projectCollection = db["projects"]

def _convert_ids(documents):
    return [{"_id": str(doc["_id"]), **doc} for doc in documents]

def get_all_projects():
    return _convert_ids(projectCollection.find())

def get_project_not_applied_to():
    return _convert_ids(projectCollection.find())

def get_project(id):
    return projectCollection.find_one({"_id": ObjectId(id)})

def get_interested_groups():
    project_groups = {}

    for project in projectCollection.find():
        project["_id"] = str(project["_id"])
        interested_groups_for_project = [
            group.get_group_by_group_name(g) for g in project.get("interested groups", [])
        ]
        project_groups[project['_id']] = interested_groups_for_project

    return project_groups

def add_project(project_obj):
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
    return projectCollection.replace_one({"_id": ObjectId(id)}, project_obj)

def delete_project_by_id(id):
    project_to_delete = get_project(id)
    group.remove_project_from_group(project_to_delete.get("project", ""))
    return projectCollection.delete_one({"_id": ObjectId(id)})

def get_project_by_name(name):
    return projectCollection.find_one({"project": name})

def add_group_to_project(projectName, group_id):
    project = get_project_by_name(projectName)
    if project["status"] == "assigned":
        return False
    return projectCollection.update_one(
        {"project": projectName},
        {"$set": {"group": group_id}}
    )

def change_status(projectName, status):
    return projectCollection.update_one(
        {"project": projectName},
        {"$set": {"status": status}}
    )

def add_interested_group_to_project(project_name, group_id):
    return projectCollection.update_one(
        {"project": project_name},
        {"$push": {"interested groups": group_id}}
    )
