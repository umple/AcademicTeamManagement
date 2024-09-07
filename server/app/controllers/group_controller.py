from flask import jsonify, request, session, make_response
from app.entities.GroupEntity import GroupEntity
from app.models import group
from bson import ObjectId, json_util
from pymongo.errors import WriteError
import json, traceback
from . import group_bp
 
@group_bp.route("/GetAllGroups", methods=["GET"])
def get_all_groups():
    try:
        group_list = group.get_all_groups()
        if group_list:
            response = {
                "groups": group_list,
                "count": len(group_list)
            }
            return jsonify(response), 200
        elif len(group_list) == 0:
            return {"message": "Group list is empty."}, 200
        else:
            return {"message": "Group list not found."}, 404
    except:
        return {"message": "Internal server error."}, 503


@group_bp.route("/AddGroup", methods=["POST"])
def add_group():
    try:
        group_obj = json.loads(request.data)
        group_id = ObjectId()
        group_entity = GroupEntity(group_id, group_obj)
        
        insert_result, next_group_number = group.add_group(group_obj)
        response_data = {"message": "Group added successfully", 
                         "group_number": next_group_number, 
                         "id": str(insert_result.inserted_id)}
        return jsonify(response_data), 201
    except Exception as e:
        # Handle the exception and return an error response
        return {"message": traceback.format_exc()}, 500

@group_bp.route("/importGroupsBulk", methods=["POST"])
def import_groups_bulk():
    global start_time, total_records, processed_records

    try:
        # start_time = time.time()
        data = request.json
        
        total_records = len(data['groups'])

        for item in data['groups']:
            group_entity = GroupEntity(item)
            result = group.add_group(group_entity)
                # processed_records += 1

        # start_time = None
        # total_records = 0
        # processed_records = 0
        return {"message": "groups imported successfully."}, 201

    except Exception as e:
        return {'message': data['groups']}, 500

@group_bp.route("/group/deleteAllGroups", methods=["DELETE"])
def delete_all_groups():
    try:
        result = group.delete_all_groups()
        return {'message': 'deleted all groups successfully.'}, 201

    except Exception as e:
        return {'message': 'An error occurred: ' + str(e)}, 500

# PUT Request to update a group info
@group_bp.route("/group/update", methods=["PUT"])    
def update_group_by_id():
    try:
        group_obj = request.json
        group_id = group_obj["_id"]
        if not ObjectId.is_valid(group_id):
            return {"message": "Invalid group ID."}, 400

        if not group_obj:
            return {"message": "Invalid JSON data in the request body."}, 400

        result = group.update_group_by_id(group_id, group_obj)
        if result:
            return jsonify({"message": "Group updated successfully."}), 200
        else:
            return {"message": "Group not found or update failed."}, 404
    except WriteError as e:
        return {"message": "An error occurred while updating the group." + str(e)}, 500
    except Exception as e:
        return {"message": "An error occurred: " + str(e)}, 500
    
# PUT Request to update a group info
@group_bp.route("/group/update/student/lock", methods=["PUT"])    
def student_lock_group_by_id():
    try:
        group_obj = request.json       
        group_id = group_obj["_id"]['$oid']
        if not ObjectId.is_valid(group_id):
            return {"message": "Invalid group ID."}, 400

        if not group_obj:
            return {"message": "Invalid JSON data in the request body."}, 400

        result = group.student_lock_group_by_id(group_id, group_obj)
        if result:
            return jsonify({"message": "Group updated successfully."}), 200
        else:
            return {"message": "Group not found or update failed."}, 404
    except WriteError as e:
        return {"message": "An error occurred while updating the group." + str(e)}, 500
    except Exception as e:
        return {"message": "An error occurred: " + str(e)}, 500
    
# PUT Request to update a group info
@group_bp.route("/group/update/student/unlock", methods=["PUT"])    
def student_unlock_group_by_id():
    try:
        group_obj = request.json
        group_id = group_obj["_id"]['$oid']  
        if not ObjectId.is_valid(group_id):
            return {"message": "Invalid group ID."}, 400

        if not group_obj:
            return {"message": "Invalid JSON data in the request body."}, 400

        result = group.student_unlock_group_by_id(group_id, group_obj)
        if result:
            return jsonify({"message": "Group updated successfully."}), 200
        else:
            return {"message": "Group not found or update failed."}, 404
    except WriteError as e:
        return {"message": "An error occurred while updating the group." + str(e)}, 500
    except Exception as e:
        return {"message": "An error occurred: " + str(e)}, 500


# DELETE Request to remove a group from the collection
@group_bp.route("/group/delete/<id>", methods=["DELETE"])
def delete_group_by_id(id):
    try:
        result = group.delete_group_by_id(id)
        if result:
            return jsonify(str(result.deleted_count)), 200
        else:
            return {"message": "Could not delete Group."}, 404
    except:
        return {"message": "Internal server error."}, 503
    
# PUT Request to remove all students from a group
@group_bp.route("/group/clear/members/<id>", methods=["PUT"])
def clear_group_members(id):
    try:
        result = group.clear_group_members(id)
        if result.modified_count > 0:
            return {"message": "Group members is cleared."}, 200
        else:
            return {"message": "Error while removing group members."}, 404
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
    
@group_bp.route("/remove/group/member/<group_id>/<orgdefinedId>", methods=["DELETE"])
def remove_student_from_group_route(group_id, orgdefinedId):
    # Attempt to remove the student from the group
    if group.remove_student_from_group(group_id, orgdefinedId):
        return jsonify({"message": "Student removed from the group successfully"}), 200
    else:
        return jsonify({"error": "Failed to remove student from the group or student not in group"}), 404
    
@group_bp.route("retrieve/curr/user/group", methods=["GET"])
def get_curr_user_group():
    user_group = group.get_user_group(session.get("user")["preferred_username"])
    if user_group == False:
        return jsonify({"error":"User is not in a group"}),200
    return jsonify(json.loads(json_util.dumps(user_group))), 200

@group_bp.route("retrieve/group/members/emails/<id>", methods=["GET"])
def get_group_members_emails(id):
    group_obj = group.get_group_by_group_name(id)
    if not group_obj:
        return jsonify({"error":"Cannot get group members emails"}),400
    members_emails = group.get_group_members_emails(group_obj)
    return jsonify(members_emails), 200

    
@group_bp.route("curr/user/in/group", methods=["GET"])
def is_curr_user_in_group():
    user_group = group.is_user_in_group(session.get("user")["name"])
    if user_group:
        return jsonify({"message": "User is in a Group"})
    else:
        return jsonify({"error":"User is not in a group"}), 400