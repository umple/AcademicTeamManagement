from flask import jsonify, request, Blueprint
from app.models import project
from bson import ObjectId
import json

project_bp = Blueprint("project_bp", __name__)

# GET Request to retrieve all projects from the collection
@project_bp.route("/projects", methods=["GET"])
def get_projects():
    try:
        project_list = project.get_all_projects()
        if not project_list:
            return jsonify({"message": "Project list is empty."}), 200
        return jsonify(project_list), 200
    except Exception as e:
        print(f"An error occurred while getting projects: {e}")
        return {"message": "Internal server error."}, 500

# POST Request to add a new project to the list
@project_bp.route("/projects", methods=["POST"])
def add_project():
    try:
        project_obj = json.loads(request.data)
        result = project.add_project(project_obj)
        if result:
            return jsonify({"message": "Project added successfully", "id": str(result.inserted_id)}), 200
        return {"message": "Could not add project."}, 404
    except Exception as e:
        print(f"An error occurred while adding project: {e}")
        return {"message": "Internal server error."}, 500

# PUT Request to update a project's information by ID
@project_bp.route("/projects/<id>", methods=["PUT"])
def update_project_by_id(id):
    try:
        project_obj = request.json
        result = project.update_project_by_id(id, project_obj)
        if result.modified_count > 0:
            return jsonify({"message": "Project updated successfully"}), 200
        return {"message": "Could not update project."}, 404
    except Exception as e:
        print(f"An error occurred while updating project: {e}")
        return {"message": "Internal server error."}, 500

# DELETE Request to remove a project from the collection by ID
@project_bp.route("/projects/<id>", methods=["DELETE"])
def delete_project_by_id(id):
    try:
        result = project.delete_project_by_id(id)
        if result.deleted_count > 0:
            return jsonify({"message": "Project deleted successfully"}), 200
        return {"message": "Could not delete project."}, 404
    except Exception as e:
        print(f"An error occurred while deleting project: {e}")
        return {"message": "Internal server error."}, 500

# GET Request to retrieve interested groups
@project_bp.route("/retrieve/interested/groups", methods=["GET"])
def retrieve_interested_groups():
    try:
        interested_groups = project.get_interested_groups()
        if not interested_groups:
            return jsonify({"message": "Interested groups list is empty."}), 404
        return jsonify(interested_groups), 200
    except Exception as e:
        print(f"An error occurred while retrieving interested groups: {e}")
        return {"message": "Internal server error."}, 500
