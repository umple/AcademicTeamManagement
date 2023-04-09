from .__init__ import db
from bson import ObjectId
from app.models import group, project
import json

projectApplicationCollection = db["projectApplications"]


def get_all_project_application():
    project_application_list = []
    for document in projectApplicationCollection.find():
        document["_id"] = str(document["_id"])
        project_application_list.append(document)
    return project_application_list


def has_project_application(project_id,student_name):
    student_group = json.loads(group.get_user_group(student_name))
    project_req = project.get_project(project_id)
    result = projectApplicationCollection.count_documents(
        {"project": project_req['project'], "group_id": student_group['group_id']})

    if result != 0:
        return True
    else:
        return False


def get_project_applications(student_name):
    try:
        project_applications = []
        student_group = json.loads(group.get_user_group(student_name))
        for document in projectApplicationCollection.find({"group_id": student_group['group_id']}):
            document["_id"] = str(document["_id"])
            project_applications.append(document)
    except Exception as e:
        print(f"An error occurred while updating project : {e}")
        return None
    return project_applications


def create_application(project_name, group_name):
    application = {
        "project":  project_name,
        "group_id": group_name,
        "feedback": "",
        "students_needed": True
    }
    result = projectApplicationCollection.insert_one(application)
    return result


def update_application(group_name, feedback, students_needed):
    application = projectApplicationCollection.find({"group_id": group_name})
    return application
