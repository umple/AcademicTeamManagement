from flask import jsonify, request
from app.models import student
# from app.controllers import  as import_controller
from bson import ObjectId
from app.utils.data_conversion import clean_up_json_data
import pandas as pd
import json
from . import student_bp


# GET Request to retreive all students from the collection
@student_bp.route("/students", methods=["GET"])
def get_students():
    try:
        student_list = student.get_all_student()
        if student_list:
            return jsonify(student_list), 200
        elif len(student_list) == 0:
            return {"message": "Students list is empty."}, 200
        else:
            return {"message": "Students list not found."}, 404
    except:
        return {"message": "Internal server error."}, 503

# POST Request to add a new student to the list
@student_bp.route("/student", methods=["POST"])
def add_student():
    try:
        student_obj = request.json
        print(student_obj)
        result = student.add_student(student_obj)
        if result:
            return jsonify(str(result.inserted_id)), 201
        else:
            return {"message": "Could not add student."}, 404
    except:
        return {"message": "Internal server error."}, 503

# GET Request to get a student by id
@student_bp.route("/student/<id>", methods=["GET"])
def get_student_by_id(id):
    try:
        document = student.get_student_by_id(id)
        if document:
            return jsonify(document), 200
        else:
            return {"message": "Students list not found."}, 404
    except:
        return {"message": "Internal server error."}, 503

# PUT Request to update a student info
@student_bp.route("/student/update/<id>", methods=["PUT"])
def update_student_by_id(id):
    try:
        student_obj = request.json
        result = student.update_student_by_id(id, student_obj)
        if result:
            return jsonify(str(result.modified_count)), 200
        else:
            return {"message": "Could not edit student."}, 404
    except:
        return {"message": "Internal server error."}, 503

# DELETE Request to remove a student from the collection
@student_bp.route("/student/delete/<id>", methods=["DELETE"])
def delete_student_by_id(id):
    try:
        result = student.delete_student_by_id(id)
        if result:
            return jsonify(str(result.deleted_count)), 200
        else:
            return {"message": "Could not delete student."}, 404
    except:
        return {"message": "Internal server error."}, 503

@student_bp.route("/importStudent", methods=["POST"])
def import_students():
    try:
        
        file = request.files["file"]
        columns = json.loads(request.form["column"])
        accessor_keys = [column['accessorKey'] for column in columns]

        result = student.import_students(file, accessor_keys)
        json_dict = json.loads(result)

        for res in json_dict:
            if (student.get_student_by_username(res["username"]) == None):
                student.add_import_student(res)
        
        return result, 201
    except :
        return {"message": "Internal server error."}, 500
