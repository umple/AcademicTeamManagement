from .__init__ import db
from bson import ObjectId
import app.models.student as student
import app.models.project as project
import app.models.section as section

groupCollection = db["groups"]

def get_all_groups():
    group_Collection = []
    for document in groupCollection.find():
        document["_id"] = str(document["_id"])
        group_Collection.append(document)
    return group_Collection

def add_group(group_obj):
    try:
        if group_obj.members:
            for org in group_obj.members:
                student.assign_group_to_student(org, groupName=group_obj.group_id)

        project.add_group_to_project(group_obj.project, group_obj.group_id)
        project.change_status(group_obj.project, "Underway")
        result = groupCollection.insert_one(group_obj.to_json())
        return result
    except Exception as e:
        # Raise the exception so it can be caught and handled in the calling code
        raise e

def get_group(id):
    result = groupCollection.find_one({"_id": ObjectId(id)})
    if result:
        return result
    else:
        return None

def get_group_by_group_name(name):
    result = groupCollection.find_one({"group_id": str(name)},  {"_id": 0})
    if result:
        return result
    else:
        return None
    
def get_groups_by_section(section):
    result = groupCollection.find({"sections": str(section)})
    if result:
        return result
    else:
        return None
    
def add_student_to_group(student_email, group_id):
    student_obj = student.get_student_by_email(student_email)
    group_obj = get_group(group_id)

    if student_obj["orgdefinedid"] in group_obj['members']:
        return False
    
    result = groupCollection.update_one(
        {"_id": ObjectId(group_obj["_id"])},
        {"$push": {"members": str(student_obj["orgdefinedid"])}})
    student.assign_group_to_student(student_obj["orgdefinedid"], group_obj["group_id"])
    if result.modified_count > 0:
        return True
    
    return False

def add_student_to_group_by_group_id(student_email, group_id):
    student_obj = student.get_student_by_email(student_email)
    group_obj = get_group_by_group_name(group_id)

    if student_obj["orgdefinedid"] in group_obj['members']:
        return False
    
    result = groupCollection.update_one(
        {"group_id": group_id},
        {"$push": {"members": str(student_obj["orgdefinedid"])}})
    student.assign_group_to_student(student_obj["orgdefinedid"], group_obj["group_id"])
    if result.modified_count > 0:
        return True
    
    return False

def remove_student_from_group_by_email(group_id, email):
    group = get_group_by_group_name(group_id)
    student_obj = student.get_student_by_email(email)
    if student_obj["orgdefinedid"] not in group['members']:
        return False
    group["members"].remove(student_obj["orgdefinedid"])
    student.remove_student_from_group(student_obj["orgdefinedid"])
    
    # unlock the group again
    if "studentLock" in group and group["studentLock"]:
        group["studentLock"] = False
    
    result = groupCollection.update_one({"group_id": group_id},  {"$set" : group})
    return result

def remove_student_from_group(group_id , orgdefinedid):
    group = get_group_by_group_name(group_id)
    if orgdefinedid in group["members"]:
        group["members"].remove(orgdefinedid)
        print(group)
        result = groupCollection.update_one({"group_id": group_id},  {"$set" : group})
        return result
    
    return False

def get_user_group(user_email):
    student_obj = student.get_student_by_email(user_email)
    group = groupCollection.find_one(
        {"members": {"$in" : [student_obj["orgdefinedid"]]}})
    
    if group != None:
        return group
    else:
        return False

    
def is_user_in_group(user_name):
    group_collection = groupCollection.find_one({"members": user_name})
    if group_collection:
        return True
    else:
        return False

from bson import ObjectId  # Assuming you are using MongoDB

def update_group_by_id(id, group_obj): 
    try:
        original_group = get_group(id)
        group_obj.pop("_id", None)
        
        if not original_group:
            return "Group not found"
        
        if "members" in group_obj and group_obj["members"]:
            for org in group_obj["members"]:
                student.assign_group_to_student(org, groupName=group_obj["group_id"])
        else:
            group_obj["members"] = []

        if original_group["group_id"] != group_obj["group_id"]:
            for orgdefinedId in group_obj["members"]:
                result = student.assign_group_to_student(orgdefinedId, groupName=group_obj["group_id"])
                
        # Update the group lock if the section has changed
        if original_group["sections"] != group_obj["sections"]:
            group_obj["professorLock"] = _update_group_lock_for_new_section(group_obj["sections"])
        
        # Update old project if the group's project has been changed
        if original_group["project"] != group_obj["project"]:
            _ = project.remove_group_from_project(original_group["project"])
            _ = project.change_status(original_group["project"], "Available")

        
        project.add_group_to_project(group_obj["project"],group_obj["group_id"])
        project.change_status(group_obj["project"], "Underway")
        
        result = groupCollection.update_one({"_id": ObjectId(id)}, {"$set": group_obj})
        
        return result.modified_count > 0
    
    except Exception as e:
        return str(e)

def professor_group_lock_status_by_id(id, group_obj, lock_status): 
    try:
        original_group = get_group(id)
        group_obj.pop("_id", None)
        
        if not original_group:
            return "Group not found"
        
        result = groupCollection.update_one(
            {"_id": ObjectId(id)}, 
            {"$set" : {
                "professorLock": lock_status
                }
            }
        )
        
        return result.modified_count > 0
    
    except Exception as e:
        return str(e)

def student_lock_group_by_id(id, group_obj): 
    try:
        original_group = get_group(id)
        group_obj.pop("_id", None)
        
        if not original_group:
            return "Group not found"
        
        result = groupCollection.update_one(
            {"_id": ObjectId(id)}, 
            {"$set" : {
                "studentLock": True
                }
            }
        )
        
        return result.modified_count > 0
    
    except Exception as e:
        return str(e)
    
def student_unlock_group_by_id(id, group_obj): 
    try:
        original_group = get_group(id)
        group_obj.pop("_id", None)
        
        if not original_group:
            return "Group not found"
        
        result = groupCollection.update_one(
            {"_id": ObjectId(id)}, 
            {"$set" : {
                "studentLock": False
                }
            }
        )
        
        return result.modified_count > 0
    
    except Exception as e:
        return str(e)

def delete_group_by_id(id):
    originalGroup  = get_group(id)
    for orgdefinedId in originalGroup["members"]:
            result = student.assign_group_to_student(orgdefinedId, groupName=None)
    result = groupCollection.delete_one({"_id": ObjectId(id)})
    project.change_status(originalGroup["project"], "Available")
    project.remove_group_from_project(originalGroup["project"])

    return result

def clear_group_members(id):
    originalGroup  = get_group(id)
    for orgdefinedId in originalGroup["members"]:
            _ = student.assign_group_to_student(orgdefinedId, groupName=None)
    result = groupCollection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"members": []}}
    )
    return result
    

def add_project_to_group(groupName,projectName):
    result = groupCollection.update_one(
            {"group_id": groupName},
            {"$set": {"project": projectName}}
        )
    return result

def remove_project_from_group(projectName):
    for group in groupCollection.find({"project": projectName}):
        result = groupCollection.update_one(
            {"group_id": group["group_id"]},
            {"$set" : {"project": ""}}
        )
        if not result:
            return result
    return True

def _update_group_lock_for_new_section(new_section_name):
    new_section = section.get_section_by_name(new_section_name)
    if "lock" in new_section:
        return new_section["lock"]
    return False
    
    