from flask import jsonify, request, session, make_response
from app.models import group
from bson import ObjectId
import pandas as pd
import json
from . import group_bp
 
@group_bp.route("/groups", methods=["GET"])
def get_groups():
    try:
        group_list = group.get_all_groups()
        if group_list:
            return jsonify(group_list), 200
        elif len(group_list) == 0:
            return {"message": "Students list is empty."}, 200
        else:
            return {"message": "Students list not found."}, 404
    except:
        return {"message": "Internal server error."}, 503


@group_bp.route("/group", methods=["POST"])
def add_group():
    try:
        group_obj = request.json
        result = group.add_group(group_obj)
        if result:
            return jsonify(str(result.inserted_id)), 201
        else:
            return {"message": "Could not add student."}, 404
    except:
        return {"message": "Internal server error."}, 503

# PUT Request to update a student info
@group_bp.route("/group/update/<id>", methods=["PUT"])
def update_group_by_id(id):
    try:
        group_obj = request.json
        result = group.update_group_by_id(id, group_obj)
        if result:
            return jsonify(str(result.modified_count)), 200
        else:
            return {"message": "Could not edit student."}, 404
    except:
        return {"message": "Internal server error."}, 503

# DELETE Request to remove a student from the collection
@group_bp.route("/group/delete/<id>", methods=["DELETE"])
def delete_group_by_id(id):
    try:
        result = group.delete_group_by_id(id)
        if result:
            return jsonify(str(result.deleted_count)), 200
        else:
            return {"message": "Could not delete student."}, 404
    except:
        return {"message": "Internal server error."}, 503
 

# GET Request to get a student by id
@group_bp.route("/add/group/member", methods=["POST"])
def add_student_to_group():
    row = json.loads(request.data)
    group_id = row["original"]["_id"]
    curr_user_email = session.get("user")["preferred_username"]

    if group.add_student_to_group(curr_user_email, group_id):
        return jsonify({"message": f"Added {curr_user_email} to group {group_id}"})
    else:
        return jsonify({"error": "Failed to add student to group"}), 400
    
@group_bp.route("/remove/group/member", methods=["DELETE"])
def remove_student_from_group():
    curr_user_email = session.get("user")["preferred_username"]

    if group.remove_student_from_group(curr_user_email):
        return jsonify({"message": f"Removed {curr_user_email} to group "})
    else:
        return jsonify({"error": "Failed to add student to group"}), 400
    
@group_bp.route("retrieve/curr/user/group", methods=["GET"])
def get_curr_user_group():
    user_group = group.get_user_group(session.get("user")["preferred_username"])
    if user_group:
        return user_group
    else:
        return jsonify({"error":"User is not in a group"}),400
    
@group_bp.route("curr/user/in/group", methods=["GET"])
def is_curr_user_in_group():
    user_group = group.is_user_in_group(session.get("user")["name"])
    if user_group:
        return jsonify({"message": "User is in a Group"})
    else:
        return jsonify({"error":"User is not in a group"}), 400
 