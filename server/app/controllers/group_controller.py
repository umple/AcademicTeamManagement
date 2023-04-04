from flask import jsonify, request
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

 


# # GET Request to get a student by id
# @student_bp.route("/associateGroupToProject", methods=["GET"])
# def get_student_by_id(id):
#     try:
#         document = groups.get_student_by_id(id)
#         if document:
#             return jsonify(document), 200
#         else:
#             return {"message": "Students list not found."}, 404
#     except:
#         return {"message": "Internal server error."}, 503

# # PUT Request to update a student info
# @student_bp.route("/student/update/<id>", methods=["PUT"])
# def update_student_by_id(id):
#     try:
#         student_obj = request.json
#         result = student.update_student_by_id(id, student_obj)
#         if result:
#             return jsonify(str(result.modified_count)), 200
#         else:
#             return {"message": "Could not edit student."}, 404
#     except:
#         return {"message": "Internal server error."}, 503
