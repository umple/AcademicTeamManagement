from flask import jsonify, request
from app.models import project
from bson import ObjectId
from . import project_bp


# GET Request to retreive all students from the collection
@project_bp.route("/project", methods=["GET"])
def get_projects():
    try:
        project_list = project.get_all_projects()
        if project_list:
            return jsonify(project_list), 200
        else:
            return {"message": "Project list not found."}, 404
    except:
        return {"message": "Internal server error."}, 503

# POST Request to add a new student to the list
@project_bp.route("/project", methods=["POST"])
def add_Project():
    try:
        project_obj = request.json
        print(project_obj)
        result = project.add_project(project_obj)
        if result:
            return jsonify(str(result.inserted_id)), 201
        else:
            return {"message": "Could not add student."}, 404
    except:
        return {"message": "Internal server error."}, 503

 