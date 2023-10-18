from flask import jsonify, request, session
from app.models import project, group
from bson import ObjectId
import json
from app.entities.ProjectEntity import ProjectEntity
from . import project_bp
from pymongo.errors import WriteError
import logging


# GET Request to retreive all students from the collection
@project_bp.route("/projects", methods=["GET"])
def get_projects():
    try:
        project_list = project.get_all_projects()
        if project_list:
            response = {
                "projects": project_list,
                "count": len(project_list)
            }
            return jsonify(response), 200
        elif len(project_list) == 0:
            return {"message": "Project list is empty."}, 200
        else:
            return {"message": "Project list not found."}, 404
    except:
        return {"message": "Internal server error."}, 503
    

# POST Request to add a new student to the list
@project_bp.route("/project", methods=["POST"])
def add_Project():
    try:
        project_data = json.loads(request.data)
        project_entity = ProjectEntity(project_data)
        result = project.add_project(project_entity)
        return jsonify(str(result.inserted_id)), 200
    except Exception as e:
        return {"message": e}, 503


@project_bp.route("/project/update", methods=["PUT"])
def update_project_by_id():
    try:
        project_obj = request.json
        project_id = project_obj["_id"]
        if not ObjectId.is_valid(project_id):
            return {"message": "Invalid project ID."}, 400

        if not project_obj:
            return {"message": "Invalid JSON data in the request body."}, 400

        result = project.update_project_by_id(project_id, project_obj)
        if result.modified_count > 0:
            return jsonify({"message": "Project updated successfully."}), 200
        else:
            return {"message": "Project not found or update failed."}, 404
    except WriteError as e:
        return {"message": "An error occurred while updating the project." + str(e)}, 500
    except Exception as e:
        return {"message": "An error occurred: " + str(e)}, 500


# DELETE Request to remove a student from the collection
@project_bp.route("/project/delete/<id>", methods=["DELETE"])
def delete_project_by_id(id):
    try:
        result = project.delete_project_by_id(id)
        if result:
            return jsonify(str(result.deleted_count)), 200
        else:
            return {"message": "Could not delete student."}, 404
    except:
        return {"message": "Internal server error."}, 503


@project_bp.route("/retrieve/interested/groups", methods=["GET"])
def retrieve_interested_groups():
    try:
        interestedGroups = project.get_interested_groups()
        if interestedGroups:
            return jsonify(interestedGroups), 200
        if len(interestedGroups) == 0 or interestedGroups is None:
            return jsonify(interestedGroups), 404
        else:
            return {"message": "Project list not found."}, 404
    except Exception as e:
        print(f"An error occurred while updating project: {e}")
        return {"message": "Error occurred while retrieving interested groups."}, 500

