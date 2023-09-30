from flask import jsonify, request, session
from app.models import project, group
from bson import ObjectId
import json
from app.entities.ProjectEntity import ProjectEntity
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
@project_bp.route("/project", methods=["POST"])
def add_Project():
    try:
        project_data = json.loads(request.data)
        project_entity = ProjectEntity(project_data)
        result = project.add_project(project_entity)
        return jsonify(str(result.inserted_id)), 200
    except Exception as e:
        return {"message": e}, 503


# PUT Request to update a student info
@project_bp.route("/project/update/<id>", methods=["PUT"])
def update_project_by_id(id):
    try:
        project_obj = request.json
        print(project_obj)
        result = project.update_project_by_id(id, project_obj)
        if result:
            return jsonify(str(result.modified_count)), 200
        else:
            return {"message": "Could not edit student."}, 404
    except:
        return {"message": "Internal server error."}, 503

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

