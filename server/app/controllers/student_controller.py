from flask import jsonify, request, session
from app.models import student, user
# from app.controllers import  as import_controller
from bson import ObjectId
from app.utils.data_conversion import clean_up_json_data
from app.entities.StudentEntity import StudentEntity
from app.entities.UserEntity import UserEntity
import json
from . import student_bp


# GET Request to retreive all students from the collection
@student_bp.route("/students", methods=["GET"])
def get_students():
    try:
        student_list = student.get_all_student()
        if student_list:
            response = {
                "students": student_list,
                "count": len(student_list)
            }
            return jsonify(response), 200
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
        student_id = ObjectId()
        student_obj = json.loads(request.data)
        student_entity = StudentEntity(student_id, student_obj)
        user_entity = UserEntity(student_id, "student", student_obj)
        result = student.add_student(student_entity)
        if result:
            # Add the student as a user
            _ = user.add_user(user_entity)
            return jsonify(str(result.inserted_id)), 201
        else:
            return {"message": "Could not add student."}, 404
    except:
        return {"message": "Internal server error."}, 503
    
@student_bp.route("/student/<email>", methods=["GET"])
def get_student_by_email(email):
    try:
        document = student.get_student_by_email(email)
        if document:
            return jsonify(document), 200
        else:
            return {"message": "Student is not found."}, 404
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
        student_obj = StudentEntity(id, json.loads(request.data))
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
        _ = user.delete_user_by_id(id)
        return jsonify({"message": f"Student deleted successfully.", "deleted_count": result}), 200
    except ValueError as ve:
        return {"message": str(ve)}, 400  # Bad Request
    except Exception as e:
        return {"message": "Internal server error.", "error": str(e)}, 500  # Internal Server Error
    
@student_bp.route("/student/delete/bulk", methods=["DELETE"])
def delete_bulk_students():
    try:
        # Load JSON data from the request body
        print("HELLO IM GETTING HERE")
        student_obj = request.get_json()
        
        # Ensure that student_obj is a dictionary
        if not isinstance(student_obj, dict):
            raise ValueError("Invalid input format. Expected a dictionary.")

        # Extract student IDs from the keys of the dictionary
        student_ids = list(student_obj.keys())

        # Perform bulk deletion
        deleted_count = student.delete_students_by_ids(student_ids)

        return jsonify({"message": f"Students deleted successfully.", "deleted_count": deleted_count}), 200

    except ValueError as ve:
        return {"message": str(ve)}, 400  # Bad Request
    except Exception as e:
        return {"message": "Internal server error.", "error": str(e)}, 500  # Internal Server Error

@student_bp.route("/importStudent", methods=["POST"])
def import_students():
    try:
       
        file = request.files["file"]
        columns = json.loads(request.form["column"])
        students_sections = request.form["sections"]
        accessor_keys = [column['accessorKey'] for column in columns]
        
        result = student.import_students(file, accessor_keys)
        json_dict = json.loads(result)

        for res in json_dict:
            if (student.get_student_by_username(res["username"]) == None):
                res["sections"] = students_sections # override the section
                res["group"] = ''
                res["professorEmail"] = session.get("user")["preferred_username"]
                student_id = ObjectId()
                student_entity = StudentEntity(student_id, res)
                user_entity = UserEntity(student_id, "student", res)
                result = student.add_student(student_entity)
                if result:
                    _ = user.add_user(user_entity)

        return {"message": "Students imported successfully."}, 201
    except :
        return {"message": "Internal server error."}, 500
