from flask import jsonify, request
from app.models import project_application as projectApplication
from bson import ObjectId
from . import project_application_bp


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
 
@project_application_bp.route("/add/project/application", methods=["POST"])
def add_project_application():
    try:
        print(request.json)
        project_obj = request.json
        result = projectApplication.add_project_application(project_obj)
        if result:
            return jsonify(str(result.inserted_id)), 201
        else:
            return {"message": "Could not add student."}, 404
    except:
        return {"message": "Internal server error."}, 503



