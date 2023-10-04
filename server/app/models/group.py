from .__init__ import db
from bson import ObjectId
import app.models.student as student
import app.models.project as project

groupCollection = db["groups"]

def get_all_groups():
    group_Collection = []
    for document in groupCollection.find():
        document["_id"] = str(document["_id"])
        group_Collection.append(document)
    return group_Collection

def add_group(group_obj):
    result = groupCollection.insert_one(group_obj)
    if group_obj["members"]:
        for id in group_obj["members"]:
            student.assign_group_to_student(id, groupName= group_obj["group_id"])
    
    project.change_status(group_obj["project"], "assigned")
    return result

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

def remove_student_from_group_by_email(group_id, email):
    group = get_group_by_group_name(group_id)
    student_obj = student.get_student_by_email(email)
    group["members"].remove(student_obj["orgdefinedid"])
    student.remove_student_from_group(student_obj["orgdefinedid"])
    result = groupCollection.update_one({"group_id": group_id},  {"$set" : group})
    return result

def remove_student_from_group(group_id , orgdefinedid):
    group = get_group_by_group_name(group_id)
    group["members"].remove(orgdefinedid)
    result = groupCollection.update_one({"group_id": group_id},  {"$set" : group})
    return result

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

def update_group_by_id(id, group_obj):
    originalGroup  = get_group(id)
    if group_obj["members"] != "":
        group_obj["members"] =  group_obj["members"].split(",")
    else:
        group_obj["members"] = []

    if originalGroup["group_id"] != group_obj["group_id"]:
        for orgdefinedId in group_obj["members"]:
                result = student.assign_group_to_student(orgdefinedId, groupName= group_obj["group_id"])
    project.change_status(group_obj["project"], "assigned")       
    
    result = groupCollection.update_one({"_id": ObjectId(id)},  {"$set" : group_obj})
    
    return result

def delete_group_by_id(id):
    originalGroup  = get_group(id)
    for orgdefinedId in originalGroup["members"]:
            result = student.assign_group_to_student(orgdefinedId, groupName=None)
    result = groupCollection.delete_one({"_id": ObjectId(id)})
    project.change_status(originalGroup["project"], "students needed")
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