from .__init__ import db
from bson import ObjectId
import app.models.student as student
import app.models.project as project
import app.models.project_application as project_application
import app.models.section as section

groupCollection = db["groups"]
groupCollection.create_index([("group_number", 1)], unique=True)

def get_all_groups():
    group_Collection = []
    for document in groupCollection.find():
        document["_id"] = str(document["_id"])
        group_Collection.append(document)
    return group_Collection

def add_group(group_obj):
    try:
        highest_group = groupCollection.find().sort("group_number", -1).limit(1)
        highest_group_number = 0
        for group in highest_group:
            highest_group_number = group.get("group_number", 0)
        next_group_number = highest_group_number + 1

        # Assign the next group number to the group object
        group_obj["group_number"] = next_group_number
        if "members" in group_obj and group_obj["members"]:
            for org in group_obj["members"]:
                student.assign_group_to_student(org, groupName=group_obj["group_id"], groupNumber= group_obj["group_number"])

        if "interest" in group_obj and group_obj["interest"] and group_obj["interest"] != '':
        # Create project applications if students are interested in projects
            _create_project_applications_for_interested_projects(group_obj)

        # add project to group if it exists
        if "project" in group_obj and group_obj["project"] and group_obj["project"] != '':
            project.add_group_to_project(group_obj["project"], group_obj["group_id"])
            project.change_status(group_obj["project"], "Underway")
        
        insert_result = groupCollection.insert_one(group_obj)
        return insert_result, next_group_number
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

def get_group_members_emails(group_obj):
    members_emails = []
    if group_obj["members"] and len(group_obj["members"]) > 0:
        for member_orgdefinedid in group_obj["members"]:
            student_email = student.get_student_email_by_orgdefinedid(member_orgdefinedid)
            if student_email != '':
                members_emails.append(student_email)
    return members_emails
    
def add_student_to_group(student_email, group_id):
    student_obj = student.get_student_by_email(student_email)
    group_obj = get_group(group_id)

    if student_obj["orgdefinedid"] in group_obj['members']:
        return False
    
    result = groupCollection.update_one(
        {"_id": ObjectId(group_obj["_id"])},
        {"$push": {"members": str(student_obj["orgdefinedid"])}})
    student.assign_group_to_student(student_obj["orgdefinedid"], group_obj["group_id"], group_obj["group_number"])
    if result.modified_count > 0:
        return True
    
    return False

def add_student_to_group_by_group_id(student_email, group_id):
    student_obj = student.get_student_by_email(student_email)
    group_obj = get_group_by_group_name(group_id)
    group_number = group_obj.get("group_number")

    if student_obj["orgdefinedid"] in group_obj['members']:
        return False
    
    result = groupCollection.update_one(
        {"group_id": group_id},
        {"$push": {"members": str(student_obj["orgdefinedid"])}}
        )
    if result.modified_count == 0:
        print("Failed to add student to group.")
        return False
    
    print({"members": str(student_obj["orgdefinedid"])})
    updated_group_obj = get_group_by_group_name(group_id)  # Fetch again to verify
    print("Updated group members:", updated_group_obj.get("members"))
    student.assign_group_to_student(student_obj["orgdefinedid"], group_obj["group_id"], group_number)
    if result.modified_count > 0:
        student_result = student.studentsCollection.update_one({"orgdefinedid": student_obj["orgdefinedid"]}, {"$set": {"group": group_id, "group_number":group_number}})
        return student_result.modified_count > 0
    
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

def bulk_remove_students_from_group(group_id , orgdefinedid):
    group = get_group_by_group_name(group_id)
    if orgdefinedid in group["members"]:
        group["members"].remove(orgdefinedid)
        group_result = groupCollection.update_one({"group_id": group_id},  {"$set" : group})

        if group_result.modified_count > 0:
            student_result = student.studentsCollection.update_one(
                {"orgdefinedid": orgdefinedid}, 
                {"$unset": {"group": None, "group_number": None}}
            )
            return student_result.modified_count > 0
    
    return False

def remove_student_from_group(id, orgdefinedId):
    originalGroup  = get_group(id)  # Assuming this fetches the group correctly
    
    for orgdefinedId in originalGroup["members"]:
            _ = student.assign_group_to_student(orgdefinedId, groupName=None, groupNumber=None)
    result = groupCollection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"members": []}}
    )
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

from bson import ObjectId  # Assuming you are using MongoDB

def update_group_by_id(id, group_obj): 
    try:
        original_group = get_group(id)
        group_obj.pop("_id", None)
        
        if not original_group:
            return "Group not found"
        
        if "members" in group_obj and group_obj["members"]:
            for org in group_obj["members"]:
                student.assign_group_to_student(org, groupName=group_obj["group_id"], groupNumber=group_obj["group_number"])
        else:
            group_obj["members"] = []

        if original_group["group_id"] != group_obj["group_id"]:          
            # update the project applications related to have the group name
            _update_group_name_to_project_applications(original_group["group_id"], group_obj["group_id"])
            
            for orgdefinedId in group_obj["members"]:
                result = student.assign_group_to_student(orgdefinedId, groupName=group_obj["group_id"], groupNumber= group_obj["group_number"])
                
        # Update the group lock if the section has changed
        if "sections" not in original_group or original_group["sections"] != group_obj["sections"]:
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
            result = student.assign_group_to_student(orgdefinedId, groupName=None, groupNumber=None)
    result = groupCollection.delete_one({"_id": ObjectId(id)})
    project.change_status(originalGroup["project"], "Available")
    project.remove_group_from_project(originalGroup["project"])
    project_application.remove_applications_of_group(originalGroup["group_id"])

    return result

def clear_group_members(id):
    originalGroup  = get_group(id)
    for orgdefinedId in originalGroup["members"]:
            _ = student.assign_group_to_student(orgdefinedId, groupName=None, groupNumber=None)
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

# update the project applications related to have the group name
def _update_group_name_to_project_applications(old_grpoup_name, new_group_name):
    project_application_list = project_application.get_project_applications_by_group_id(old_grpoup_name)
    for project_app in project_application_list:
        project_app["group_id"] = new_group_name
        _ = project_application.update_project_application_by_id(project_app["_id"], project_app)
        
# Create project applications if students are interested in projects
def _create_project_applications_for_interested_projects(group_obj):
    if group_obj.interest and len(group_obj.interest) > 0:
        # get the email of the student who submitted the group application
        # if exists, or just assign the group id to it
        student_email = group_obj.group_id
        if group_obj.members and len(group_obj.members) > 0:
            student_email = student.get_student_email_by_orgdefinedid(group_obj.members[0])
            
        for project_name in group_obj.interest:
            project_application.create_application(project_name, student_email, group_obj.group_id)