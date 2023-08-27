from flask import jsonify, request, session
from app.models import project_application as projectApplication
from bson import ObjectId
from . import project_application_bp
import json


# GET Request to retreive all students from the collection
@project_application_bp.route("/project/applications", methods=["GET"])
def get_project_application():
    try:
        project_list = projectApplication.get_all_project_application()
        if project_list:
            return jsonify(project_list), 200
        elif len(project_list) == 0:
            return jsonify([]), 200
        else:
            return {"message": "Project list not found."}, 404
    except:
        return {"message": "Internal server error."}, 503

@project_application_bp.route("/retrieve/project/application", methods=["GET"])
def retrieve_project_application():
    try:
        student_email = session.get("user")["preferred_username"]
        result = projectApplication.get_project_applications(student_email)
        if result:
                return jsonify(result), 200
        else:
                return {"message": "Could not delete student."}, 404
    except:
        return {"message": "Internal server error."}, 503


# @project_application_bp.route("/has/project/application/<id>", methods=["GET"])
# def has_project_application(id):
#     try:
#         student_name = session.get("user")["name"]
#         result = projectApplication.has_project_application(
#             str(id), student_name)
        
#         if result:
#             return  jsonify(True), 200
#         else:
#             return jsonify(False), 200
#     except:
#         return {"message": "Internal server error."}, 503
    

@project_application_bp.route("/send/feedback/to/group", methods=["POST"])
def send_feedback_application():
    try:
        project_json = json.loads(request.data)
        result = projectApplication.send_feedback_to_group(project_json)
        return jsonify(result.modified_count), 200
    except:
        return {"message": "Internal server error."}, 500
    

@project_application_bp.route("/assign/project/to/group", methods=["POST"])
def assign_project_to_group():
    try:
        project_json = json.loads(request.data)
        project, group = projectApplication.assign_project_to_group(project_json)
        if project and group:
            return jsonify(project.modified_count), 200
    except:
        return {"message": "Internal server error."}, 503


@project_application_bp.route("/request/join/project", methods=["POST"])
def request_project_application():
    try:
        data = request.json
        student_email = session.get("user")["preferred_username"]
        result, status = projectApplication.request_project_application(
            data['project_name'], student_email, data["group_id"])
        if status == 400:
            return  {"message": "Application Already Sent."}, 400
        if result:
            return jsonify("Application Sent!"), 200
        else:
            return {"message": "Internal Server Error"}, 500
    except Exception as e :
        print(e)
        return {"message": e}, 503