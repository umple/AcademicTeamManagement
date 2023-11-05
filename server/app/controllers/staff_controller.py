from flask import jsonify, request
from app.models import staff, user
from app.entities.StaffEntity import StaffEntity
from app.entities.UserEntity import UserEntity
import json
from bson import ObjectId
from . import staff_bp


# GET Request to retreive all staffs from the collection
@staff_bp.route("/staffs", methods=["GET"])
def get_staffs():
    try:
        staff_list = staff.get_all_staff()
        if staff_list:
            response = {
                "staff": staff_list,
                "count": len(staff_list)
            }
            return jsonify(response), 200
        elif len(staff_list) == 0:
            return {"message": "Staffs list is empty."}, 200
        else:
            return {"message": "Staffs list not found."}, 404
    except:
        return {"message": "Internal server error."}, 503

# POST Request to add a new staff to the list
@staff_bp.route("/staff", methods=["POST"])
def add_staff():
    try:
        staff_id = ObjectId()
        staff_obj = json.loads(request.data)
        staff_role = staff_obj.get('role', '')
        staff_entity = StaffEntity(staff_id, staff_obj)
        user_entity = UserEntity(staff_id, staff_role, staff_obj)
        result = staff.add_staff(staff_entity)
        if result:
            # Add the student as a user
            _ = user.add_user(user_entity)
            return jsonify(str(result.inserted_id)), 201
        else:
            return {"message": "Could not add staff."}, 404
    except:
        return {"message": "Internal server error."}, 503
    
@staff_bp.route("/staff/<email>", methods=["GET"])
def get_staff_by_email(email):
    try:
        document = staff.get_staff_by_email(email)
        if document:
            return jsonify(document), 200
        else:
            return {"message": "Staffs list not found."}, 404
    except:
        return {"message": "Internal server error."}, 503

# GET Request to get a staff by id
@staff_bp.route("/staff/<id>", methods=["GET"])
def get_staff_by_id(id):
    try:
        document = staff.get_staff_by_id(id)
        if document:
            return jsonify(document), 200
        else:
            return {"message": "staff list not found."}, 404
    except:
        return {"message": "Internal server error."}, 503

# PUT Request to update a staff info
@staff_bp.route("/staff/update/<id>", methods=["PUT"])
def update_staff_by_id(id):
    try:
        staff_obj = StaffEntity(id, json.loads(request.data))
        result = staff.update_staff_by_id(id, staff_obj)
        if result:
            return jsonify(str(result.modified_count)), 200
        else:
            return {"message": "Could not edit staff."}, 404
    except:
        return {"message": "Internal server error."}, 503

# DELETE Request to remove a staff from the collection
@staff_bp.route("/staff/delete/<id>", methods=["DELETE"])
def delete_staff_by_id(id):
    try:
        result = staff.delete_staff_by_id(id)
        _ = user.delete_user_by_id(id)
        return jsonify({"message": f"Staff deleted successfully.", "deleted_count": result}), 200
    except ValueError as ve:
        return {"message": str(ve)}, 400  # Bad Request
    except Exception as e:
        return {"message": "Internal server error.", "error": str(e)}, 500  # Internal Server Error

 