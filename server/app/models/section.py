from app.models import student, group
from .__init__ import db
from bson import ObjectId

sectionsCollection = db["sections"]

def get_all_sections():
    section_list = []
    for document in sectionsCollection.find():
        document["_id"] = str(document["_id"])
        section_list.append(document)
    return section_list

def add_section(section_obj):
    try:
        result = sectionsCollection.insert_one(section_obj.to_json())
        return result
    except Exception as e:
        print(f"Error adding section: {e}")
        return None

def get_section_by_id(a):
    document = sectionsCollection.find_one({"_id": ObjectId(a)})
    return document

def get_section_by_name(name):
    document = sectionsCollection.find_one({"name": name})
    if(document is not None):
        document["name"] = str(document["name"])

    else:
        return None

    return document

def update_section_by_id(id, section_obj):
    old_section_name = get_section_by_id(id)["name"]
    old_section_lock = get_section_by_id(id)["lock"]
    
    result = sectionsCollection.update_one({"_id": ObjectId(id)}, {
        "$set":section_obj.to_json()
    })
    if result and (old_section_name != section_obj.to_json()["name"]):
        _update_section_name_for_students(old_section_name, section_obj.to_json()["name"])
        
    # handle lock/unlock section
    if result and (old_section_lock != section_obj.to_json()["lock"]):
        _update_section_status_for_groups(section_obj.to_json()["name"], section_obj.to_json()["lock"])
    
    return result.modified_count > 0

def delete_section_by_id(a):
    try:
        section_to_delete = get_section_by_id(a)
        if section_to_delete is not None:
            # Delete the section document
            result = sectionsCollection.delete_one({"_id": ObjectId(a)})

            if result.deleted_count > 0:
                return "Successfully deleted section"
            else:
                return "No sections where deleted"
        else:
            return "Section not found"

    except Exception as e:
        raise e

def _update_section_name_for_students(old_section_name, new_section_name):
    students = student.get_all_students_by_section(old_section_name)
    for st in students:
        _ = student.update_section_for_student(str(st["_id"]), new_section_name)
        
def _update_section_status_for_groups(section_name, section_lock):
    groups = group.get_groups_by_section(section_name)
    for gr in groups:
        _ = group.professor_group_lock_status_by_id(gr["_id"], gr, section_lock)