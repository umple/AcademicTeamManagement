from flask import jsonify, request
from app.models import group
# from app.controllers import  as import_controller
from bson import ObjectId
from app.utils.data_conversion import clean_up_json_data
import pandas as pd
import json
from . import group_bp

# GET Request to retreive all students from the collection
@group_bp.route("/retrieveGroups", methods=["GET"])
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


@group_bp.route("/fetchGroupApplication", methods=["GET"])
def fetch_group_application():
    return None 

 


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
