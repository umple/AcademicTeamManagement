from .__init__ import db
from bson import ObjectId
import app.models.student as student
import app.models.project as project
import app.models.project_application as project_application
import app.models.section as section
from bson import ObjectId  # Assuming you are using MongoDB

groupCollection = db["groups"]

def get_all_groups():
    group_Collection = []
    for document in groupCollection.find():
        document["_id"] = str(document["_id"])
        group_Collection.append(document)
    return group_Collection

def delete_all_groups():
    for document in groupCollection.find():
        delete_group_by_id(document['_id'])

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
        if group_obj.assigned_project_id and group_obj.assigned_project_id != '':
            project.add_group_to_project(group_obj.assigned_project_id, group_obj.group_id)
            project.change_status(group_obj.assigned_project_id, "Underway")
        
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
    
def get_groups_by_section(section):
    result = groupCollection.find({"sections": str(section)})
    if result:
        return result
    else:
        return None

def get_group_members(group_obj):
    members = []
    if group_obj["members"] and len(group_obj["members"]) > 0:
        for member in group_obj["members"]:
            student_id = student.get_student(member)['_id']
            members.append(student_email)
    return members
    
def add_student_to_group(group_id, student_id):
    student_obj = student.get_student(ObjectId(student_id))
    group_obj = get_group(ObjectId(group_id))

    if student_obj['_id'] in group_obj['members']:
        return False
    
    result = groupCollection.update_one(
        {"_id": ObjectId(group_obj["_id"])},
        {"$push": {"members": str(student_obj['_id'])}})
    student.assign_group_to_student(student_obj['_id'], group_obj['_id'])
    if result.modified_count > 0:
        return True
    
    return False

def remove_student_from_group(group_id, student_id):
    group = get_group(ObjectId(group_id))
    if student_id in group["members"]:
        group["members"].remove(ObjectId(student_id))
        result = groupCollection.update_one({"group_id": ObjectId(group_id)},  {"$set" : group})
        return result
    
    return False

def get_user_group(user_email):
    student_obj = student.get_student_by_email(user_email)
    group = groupCollection.find_one(
        {"members": {"$in" : [student_obj["student_number"]]}})
    
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
    try:
        original_group = groupCollection.find_one({"_id": ObjectId(id)})
        data = group_obj.to_json()
        del data['_id']

        # REVISIT
        # if not original_group:
        #     return "Group not found"
        
        # if "members" in group_obj and group_obj["members"]:
        #     for org in group_obj["members"]:
        #         student.assign_group_to_student(org, groupName=group_obj["group_id"])
        # else:
        #     group_obj["members"] = []

        # if original_group["group_id"] != group_obj["group_id"]:          
        #     # update the project applications related to have the group name
        #     _update_group_name_to_project_applications(original_group["group_id"], group_obj["group_id"])
            
        #     for orgdefinedId in group_obj["members"]:
        #         result = student.assign_group_to_student(orgdefinedId, groupName=group_obj["group_id"])
                
        # # Update the group lock if the section has changed
        # if "sections" not in original_group or original_group["sections"] != group_obj["sections"]:
        #     group_obj["professorLock"] = _update_group_lock_for_new_section(group_obj["sections"])
        
        # # Update old project if the group's project has been changed
        # if original_group["project"] != group_obj["project"]:
        #     _ = project.remove_group_from_project(original_group["project"])
        #     _ = project.change_status(original_group["project"], "Available")

        
        # project.add_group_to_project(group_obj["project"],group_obj["group_id"])
        # project.change_status(group_obj["project"], "Underway")
        
        result = groupCollection.update_one({"_id": ObjectId(id)}, {"$set": data})
        
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
    project.change_status(originalGroup["assigned_project_id"], "Available")
    project.remove_group_from_project(originalGroup["assigned_project_id"])
    project_application.remove_applications_of_group(originalGroup["_id"])

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
    

def add_project_to_group(group_id,project_id):
    result = groupCollection.update_one(
            {"_id": group_id},
            {"$set": {"assigned_project_id": project_id}}
        )
    return result

def remove_project_from_group(group_id):
    result = groupCollection.update_one(
        {"_id": ObjectId(group_id)},
        {"$set" : {"assigned_project_id": ""}}
    )
    return result

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
    if group_obj.interested_project_ids and len(group_obj.interested_project_ids) > 0:
        # get the email of the student who submitted the group application
        # if exists, or just assign the group id to it
        student_email = group_obj.group_id
        if group_obj.members and len(group_obj.members) > 0:
            student_email = student.get_student_email_by_orgdefinedid(group_obj.members[0])
            
        for project_name in group_obj.interested_project_ids:
            project_application.create_application(project_name, student_email, group_obj.group_id)