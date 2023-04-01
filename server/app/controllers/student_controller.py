from flask import jsonify, request
from app.models import student
from bson import ObjectId
from . import student_bp


# GET Request to retreive all students from the collection
@student_bp.route("/api/student", methods=["GET"])
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
@student_bp.route("/api/student", methods=["POST"])
def add_student():
    try:
        student_obj = request.json
        result = student.add_student(student_obj)
        if result:
            return jsonify(str(result.inserted_id)), 201
        else:
            return {"message": "Could not add student."}, 404
    except:
        return {"message": "Internal server error."}, 503

# GET Request to get a student by id
@student_bp.route("/api/student/<id>", methods=["GET"])
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
@student_bp.route("/api/student/<id>", methods=["PUT"])
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
@student_bp.route("/api/student/<id>", methods=["DELETE"])
def delete_student_by_id(id):
    try:
        result = student.delete_student_by_id(id)
        if result:
            return jsonify(str(result.deleted_count)), 200
        else:
            return {"message": "Could not delete student."}, 404
    except:
        return {"message": "Internal server error."}, 503
