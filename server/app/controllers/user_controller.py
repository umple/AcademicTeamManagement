from flask import jsonify, request
from app.models import user
from app.entities.UserEntity import UserEntity
import json
from . import user_bp


# GET Request to retreive all users from the collection
@user_bp.route("/users", methods=["GET"])
def get_users():
    try:
        user_list = user.get_all_users()
        if user_list:
            response = {
                "users": user_list,
                "count": len(user_list)
            }
            return jsonify(response), 200
        elif len(user_list) == 0:
            return {"message": "Users list is empty."}, 200
        else:
            return {"message": "Users list not found."}, 404
    except:
        return {"message": "Internal server error."}, 503

# POST Request to add a new user to the list
@user_bp.route("/user", methods=["POST"])
def add_user():
    try:
        user_obj = json.loads(request.data)
        user_entity = UserEntity(user_obj)
        result = user.add_user(user_entity)
        if result:
            return jsonify(str(result.inserted_id)), 201
        else:
            return {"message": "Could not add user."}, 404
    except:
        return {"message": "Internal server error."}, 503
    
@user_bp.route("/user/<email>", methods=["GET"])
def get_user_by_email(email):
    try:
        document = user.get_user_by_email(email)
        if document:
            return jsonify(document), 200
        else:
            return {"message": "Users list not found."}, 404
    except:
        return {"message": "Internal server error."}, 503

# GET Request to get a user by id
@user_bp.route("/user/<id>", methods=["GET"])
def get_user_by_id(id):
    try:
        document = user.get_user_by_id(id)
        if document:
            return jsonify(document), 200
        else:
            return {"message": "users list not found."}, 404
    except:
        return {"message": "Internal server error."}, 503

# PUT Request to update a user info
@user_bp.route("/user/update/<id>", methods=["PUT"])
def update_user_by_id(id):
    try:
        user_obj = UserEntity(json.loads(request.data))
        result = user.update_user_by_id(id, user_obj)
        if result:
            return jsonify(str(result.modified_count)), 200
        else:
            return {"message": "Could not edit user."}, 404
    except:
        return {"message": "Internal server error."}, 503

# DELETE Request to remove a user from the collection
@user_bp.route("/user/delete/<id>", methods=["DELETE"])
def delete_user_by_id(id):
    try:
        result = user.delete_user_by_id(id)
        return jsonify({"message": f"User deleted successfully.", "deleted_count": result}), 200
    except ValueError as ve:
        return {"message": str(ve)}, 400  # Bad Request
    except Exception as e:
        return {"message": "Internal server error.", "error": str(e)}, 500  # Internal Server Error

 