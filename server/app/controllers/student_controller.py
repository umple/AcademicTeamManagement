from flask import jsonify, request, session
from app.models import student, user
# from app.controllers import  as import_controller
from bson import ObjectId
from app.utils.data_conversion import clean_up_json_data
from app.entities.StudentEntity import StudentEntity
from app.entities.UserEntity import UserEntity
import json
from . import student_bp
import time

#GLOBAL VARIABLES
start_time = None #start time of importing
total_records = 0 #total rows imported
processed_records = 0 #total rows completed on import

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
        result = student.add_student(student_entity)
        if result:
            # Add the student as a user
            _ = user.add_user(student_entity)
            return jsonify(str(result.inserted_id)), 201
        else:
            return {"message": result}, 404
    except Exception as e:
        return {"message": repr(e)}, 503
    
# @student_bp.route("/student/<email>", methods=["GET"])
# def get_student_by_email(email):
#     try:
#         document = student.get_student_by_email(email)
#         if document:
#             return jsonify(document), 200
#         else:
#             return {"message": "Student is not found."}, 404
#     except:
#         return {"message": "Internal server error."}, 503

# GET Request to get a student by id
@student_bp.route("/student/<id>", methods=["GET"])
def get_student_by_id(id):
    try:
        document = student.get_student_by_id(id)
        if document:
            document['_id'] = str(document['_id'])
            return jsonify(document), 200
        else:
            return {"message": "Students list not found."}, 404
    except Exception as e:
        return {"message": "Internal server eor."+repr(e)}, 503

# PUT Request to update a student info
@student_bp.route("/student/update/<id>", methods=["PUT"])
def update_student_by_id(id):
    try:
        student_obj = StudentEntity(id, json.loads(request.data))
        # del student_obj["_id"]
        result = student.update_student_by_id(id, student_obj)
        _ = user.update_user_by_id(id, student_obj)
        if result:
            return jsonify(str(result)), 200
        else:
            return {"message": "Could not edit student."}, 404
    except Exception as e:
        return {"message": "Internal server error."+repr(e)}, 503

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
    
@student_bp.route("/student/update/group/bulk", methods=["PUT"])
def update_group_bulk_students():
    try:
        # Load JSON data from the request body      
        data = request.get_json()
        
        # Get the data from the form
        new_group = data["group"]
        students = data["students"]
                
        # Extract student IDs from the keys of the dictionary
        student_ids = list(students.keys())
               
        # Perform bulk update to the groups
        update_count = student.bulk_group_update_students_by_ids(student_ids, new_group)

        return jsonify({"message": f"Students updated successfully.", "update_count": update_count}), 200

    except ValueError as ve:
        return {"message": str(ve)}, 400  # Bad Request
    except Exception as e:
        return {"message": "Internal server error.", "error": str(e)}, 500  # Internal Server Error

# can be removed once per table importing is deprecated
@student_bp.route("/importStudent", methods=["POST"])
def import_students():
    global start_time, total_records, processed_records

    try:
        start_time = time.time()
        file = request.files["file"]
        columns = json.loads(request.form["column"])
        students_sections = request.form["sections"]
        accessor_keys = [column['accessorKey'] for column in columns]
        
        result = student.import_students(file, accessor_keys)
        json_dict = json.loads(result)

        # Update total_records based on the number of records in the file
        total_records = len(json_dict)

        for res in json_dict:
            if student.get_student_by_username(res["username"]) is None:
                res["sections"] = students_sections  # override the section
                res["group"] = ''
                res["email"] = res["email"].lower()
                res["professorEmail"] = session.get("user")["preferred_username"]
                student_id = ObjectId()
                student_entity = StudentEntity(student_id, res)
                user_entity = UserEntity(student_id, "student", res)
                result = student.add_student(student_entity)
                if result:
                    _ = user.add_user(user_entity)

                    # Increment processed_records as each record is processed
                    processed_records += 1
        
        # Reset the global variables upon completion
        start_time = None
        total_records = 0
        processed_records = 0
        return {"message": "Students imported successfully."}, 201
    except Exception as e:
        return {"message": f"Please verify the file to match the same as the tempalte"}, 500

@student_bp.route("/getTime/completion", methods=["GET"])
def get_time_completion_in_percentage():
    global start_time, total_records, processed_records

    if start_time is None:
        return {"error": "No task in progress."}, 400

    current_time = time.time()
    elapsed_time = current_time - start_time

    # Avoid division by zero
    if total_records == 0:
        completion_percentage = 0
    else:
        # Additional check to handle processed_records being zero
        completion_percentage = (processed_records / max(1, total_records)) * 100

    # Return the completion percentage and estimated end time
    return jsonify({
        "completion_percentage": completion_percentage,
        "estimated_end_time": start_time + (elapsed_time / max(1, processed_records)) * total_records,
    })
