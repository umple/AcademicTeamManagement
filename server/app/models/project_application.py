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


def has_project_application(project_obj,student_group):
    try:
        result = projectApplicationCollection.count_documents(
            {"project": project_obj['project'], "group_id": student_group['group_id']})
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
        student_group = json.loads(group.get_user_group(student_email))
        for document in projectApplicationCollection.find({"group_id": student_group['group_id']}):
            document["_id"] = str(document["_id"])
            project_applications.append(document)
    except Exception as e:
        print(f"An error occurred while updating project : {e}")
        return None
    return project_applications


def request_project_application(project_id, student_email):
    try:
        student_group =  json.loads(group.get_user_group(student_email))
        project_obj = project.get_project(project_id)
        if (has_project_application(project_obj, student_group)):
            return Exception(f"Application already Submitted {project_id}.") , 400
         
        result = project.add_interested_group_to_project(project_id,student_group)

        if result.modified_count > 0 or result.matched_count > 0:
            applications = create_application(project_obj['project'], student_group['group_id'])
        else:
            raise Exception(f"Could not update project {project_id}.")
        return result, 200
    except Exception as e:
        print(e)
        return e, 400



def create_application(project_name, group_name):
    application = {
        "project":  project_name,
        "group_id": group_name,
        "feedback": "",
        "students_needed": False
    }
    result = projectApplicationCollection.insert_one(application)
    return result


def assign_project_to_group(group_obj):
    try:
        proj_obj = project.get_project(group_obj['project_id'])

        result = project.add_group_to_project(group_obj)

        result2 = group.add_project_to_group(group_obj,proj_obj)

        if result.modified_count > 0 and result2.modified_count > 0:
            return result, result2
    except Exception as e:
        return None
 
def update_application(group_name, feedback, students_needed):
    application = projectApplicationCollection.find({"group_id": group_name})
    return application
