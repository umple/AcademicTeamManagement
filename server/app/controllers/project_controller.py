from flask import jsonify, request
from app.models import project
from bson import ObjectId
from . import project_bp


# GET Request to retreive all students from the collection
@project_bp.route("/projects", methods=["GET"])
def get_projects():
    try:
        project_list = project.get_all_projects()
        if project_list:
            return jsonify(project_list), 200
        elif len(project_list) == 0:
            return {"message": "Project list is empty."}, 200
        else:
            return {"message": "Project list not found."}, 404
    except:
        return {"message": "Internal server error."}, 503
 
# POST Request to add a new student to the list
@project_bp.route("/api/project", methods=["POST"])
def add_Project():
    try:
        project_obj = request.json
        result = project.add_project(project_obj)
        if result:
            return jsonify(str(result.inserted_id)), 201
        else:
            return {"message": "Could not add student."}, 404
    except:
        return {"message": "Internal server error."}, 503


# PUT Request to update a student info
@project_bp.route("/api/project/update/<id>", methods=["PUT"])
def update_project_by_id(id):
    try:
        project_obj = request.json
        result = project.update_project_by_id(id, project_obj)
        if result:
            return jsonify(str(result.modified_count)), 200
        else:
            return {"message": "Could not edit student."}, 404
    except:
        return {"message": "Internal server error."}, 503

# DELETE Request to remove a student from the collection
@project_bp.route("/api/project/delete/<id>", methods=["DELETE"])
def delete_project_by_id(id):
    try:
        result = project.delete_project_by_id(id)
        if result:
            return jsonify(str(result.deleted_count)), 200
        else:
            return {"message": "Could not delete student."}, 404
    except:
        return {"message": "Internal server error."}, 503

