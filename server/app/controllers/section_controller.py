from flask import jsonify, request
from app.models import section
import json
from bson import ObjectId
from app.entities.SectionEntity import SectionEntity
from . import section_bp


# GET Request to retreive all sections from the collection
@section_bp.route("/sections", methods=["GET"])
def get_sections():
    try:
        section_list = section.get_all_sections()
        if section_list:
            response = {
                "sections": section_list,
                "count": len(section_list)
            }
            return jsonify(response), 200
        elif len(section_list) == 0:
            return {"message": "Sections list is empty."}, 200
        else:
            return {"message": "Sections list not found."}, 404
    except:
        return {"message": "Internal server error."}, 503

# POST Request to add a new section to the list
@section_bp.route("/section", methods=["POST"])
def add_section():
    try:
        section_obj = json.loads(request.data)
        section_id = ObjectId()
        section_entity = SectionEntity(section_id,section_obj)
        result = section.add_section(section_entity)
        if result:
            return jsonify(str(result.inserted_id)), 201
        else:
            return {"message": "Could not add section."}, 404
    except Exception as e:
        return {"message": "Internal server error. " +repr(e)}, 503
    
@section_bp.route("/section/<name>", methods=["GET"])
def get_section_by_name(name):
    try:
        document = section.get_section_by_name(name)
        if document:
            return jsonify(document), 200
        else:
            return {"message": "Sections list not found."}, 404
    except:
        return {"message": "Internal server error."}, 503

# GET Request to get a section by id
@section_bp.route("/section/<id>", methods=["GET"])
def get_section_by_id(id):
    try:
        document = section.get_section_by_id(id)
        if document:
            return jsonify(document), 200
        else:
            return {"message": "sections list not found."}, 404
    except:
        return {"message": "Internal server error."}, 503

# PUT Request to update a section info
@section_bp.route("/section/update/<id>", methods=["PUT"])
def update_section_by_id(id):
    try:
        section_obj = SectionEntity(json.loads(request.data))
        result = section.update_section_by_id(id, section_obj)
        if result:
            return {"message": "Updated section successfully."}, 200
        else:
            return {"message": "Could not edit section."}, 404
    except:
        return {"message": "Internal server error."}, 503

# DELETE Request to remove a section from the collection
@section_bp.route("/section/delete/<id>", methods=["DELETE"])
def delete_section_by_id(id):
    try:
        result = section.delete_section_by_id(id)
        return jsonify({"message": f"Section deleted successfully.", "deleted_count": result}), 200
    except ValueError as ve:
        return {"message": str(ve)}, 400  # Bad Request
    except Exception as e:
        return {"message": "Internal server error.", "error": str(e)}, 500  # Internal Server Error
