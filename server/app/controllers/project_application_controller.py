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
            return {"message": "Project list is empty."}, 200
        else:
            return {"message": "Project list not found."}, 404
    except:
        return {"message": "Internal server error."}, 503
 

@project_application_bp.route("/retrieve/project/application", methods=["GET"])
def retrieve_project_application():
    try:
        student_name = session.get("user")["name"]
        print(student_name)
        result = projectApplication.get_project_applications(student_name)
        if result:
                return jsonify(result), 200
        else:
                return {"message": "Could not delete student."}, 404
    except:
        return {"message": "Internal server error."}, 503


@project_application_bp.route("/has/project/application/<id>", methods=["GET"])
def has_project_application(id):
    try:
        student_name = session.get("user")["name"]
        result = projectApplication.has_project_application(
            str(id), student_name)
        
        if result:
            return  jsonify(True), 200
        else:
            return jsonify(False), 200
    except:
        return {"message": "Internal server error."}, 503




        
