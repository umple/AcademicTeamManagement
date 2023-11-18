from .__init__ import db
from bson import ObjectId
from app.models import group, project
import json
from flask import jsonify

projectApplicationCollection = db["projectApplications"]

def get_all_project_application():
    project_application_list = []
    for document in projectApplicationCollection.find():
        document["_id"] = str(document["_id"])
        project_application_list.append(document)
    # print(project_application_list)
    return project_application_list

def has_project_application(project_name,student_group):
    try:
        result = projectApplicationCollection.count_documents(
            {"project": project_name, "group_id": student_group, "status": {"$in": ["Requested", "Rejected", "Accepted"]}}
        )
        print(result)
        if result != 0:
            return True
        else:
            return False
    except Exception as e:
        print(e)
        return False
    
def send_feedback_to_group(feedback_obj):
    project_application = projectApplicationCollection.find_one({"group_id": feedback_obj['group_id']})
    if project_application:
        result = projectApplicationCollection.update_one(
        {"group_id": feedback_obj['group_id']},
        {"$set": {"feedback": feedback_obj['feedback'], "students_needed": bool(feedback_obj['students_needed'])}}
        )
        return result


def get_project_applications(student_email):
    try:
        project_applications = []
        student_group = group.get_user_group(student_email)
        project_applications_for_group = projectApplicationCollection.find({"group_id": student_group['group_id']})
        for document in project_applications_for_group:
            document["_id"] = str(document["_id"])
            project_applications.append(document)
    except Exception as e:
        print(f"An error occurred while updating project : {e}")
        return None
    return project_applications


def request_project_application(project_name, student_email, group_id):
    try:
        if (has_project_application(project_name, group_id)):
            return Exception(f"Application already Submitted {project_name}.") , 400
        create_application(project_name, student_email, group_id)
        return True, 200
    except Exception as e:
        print(e)
        return e, 500



def create_application(project_name, student_email, group_name):
    application = {
        "project":  project_name,
        "group_id": group_name,
        "submitted_by": student_email,
        "feedback": "",
        "ranking": 0,
        "status": "Requested",
    }
    result = projectApplicationCollection.insert_one(application)
    return result


def assign_project_to_group(group_obj):
    try:
        proj_obj = project.get_project(group_obj['project_id'])

        result = project.add_group_to_project(group_obj)
        result2 = group.add_project_to_group(group_obj,proj_obj)


        # Laith we also need to add that every student is assigned a project

        if result.modified_count > 0 and result2.modified_count > 0:
            return result, result2
    except Exception as e:
        return None

def update_project_application_by_id(id, updated_fields):
    updated_fields.pop("_id", None)
    result = projectApplicationCollection.update_one(
        {"_id": ObjectId(id)},
        {"$set": updated_fields}
    )
    return result

def reviewApplication(applicationObject):
    result = True
    if applicationObject["status"] == "Accepted":
        result = project.add_group_to_project(applicationObject["project"], applicationObject["group_id"])
        if not result:
            return False, 400
        group.add_project_to_group(applicationObject["group_id"], applicationObject["project"])
        project.change_status(applicationObject["project"], "Underway")
    # x = applicationObject.pop(applicationObject["_id"], None)
    id = ObjectId(applicationObject["_id"])
    applicationObject.pop("_id", None)
    result = projectApplicationCollection.update_one({"_id": id}, {"$set" : applicationObject})
    return result, 200