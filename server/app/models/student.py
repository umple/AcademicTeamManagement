from app.models import user, staff, group
from .__init__ import db
from bson import ObjectId
from app.utils.data_conversion import clean_up_json_data
import pandas as pd
from flask import session

studentsCollection = db["students"]

def get_all_student():
    student_list = []
    for document in studentsCollection.find():
        document["_id"] = str(document["_id"])
        student_list.append(document)
    return student_list

def add_student(student_obj):
    # check if attached prof is valid
    try:
        # professor = staff.get_staff_by_id(student_obj.professorId)
        # if professor is None:
        #     student_obj.professorId = None
        if group.get_group(student_obj.group_id) == None:
            raise KeyError("Student group id is invalid or can't be found")

        result = studentsCollection.insert_one(student_obj.to_json())
        return result
    except Exception as e:
        print(f"Error adding student: {e}")
        return None

# are all these get x by y functions necessary?
# 
# wouldn't it be better to only get a student object from the api
# then get whatever attributes you need from there?

def get_student_by_id(a):
    document = studentsCollection.find_one({"_id": ObjectId(a)})
    return document

def get_student_by_email(email):
    document = studentsCollection.find_one({"email": email})
    document['_id'] = str(document['_id'])
    return document

def get_student_email_by_orgdefinedid(orgdefinedid):
    document = studentsCollection.find_one({"orgdefinedid": orgdefinedid})
    student_email = ''
    if document:
        student_email = str(document['email'])
    return student_email

def get_student_name_from_email(email):
    fullName = ""
    document = studentsCollection.find_one({"email": email})
    if (document != None):
        fullName = str(document["firstname"]) + ' ' + str(document["lastname"])
        return fullName
    return "Invalid Email"

def get_student_by_username(username):
    document = studentsCollection.find_one({"username": str(username)})
    if document:
        username_field = document.get("username")
        if isinstance(username_field, str):
            document["username"] = str(username_field)
    return document

def get_all_students_by_section(section):
    documents = studentsCollection.find({"sections": str(section)})
    students_list = []
    for student in documents:
        students_list.append(student)
    return students_list

def update_student_by_id(id, student_obj):
    data = student_obj.to_json()
    del data["_id"]
    result = studentsCollection.update_one({"_id": ObjectId(id)}, {
        "$set":data
    })
    return result

def assign_group_to_student(orgdefinedid, groupName, groupNumber):
    result = studentsCollection.update_one(
        {"orgdefinedid" : orgdefinedid}, 
        {"$set" : {
            "group": groupName,
            "group_number": groupNumber  # Add the group number to the student document
        }
        }
    )
    return result

def update_section_for_student(id, new_section):
    result = studentsCollection.update_one(
        {"_id": ObjectId(id)}, 
        {"$set" : {
            "sections": new_section
        }
        }
    )
    return result

def remove_student_from_group(orgdefinedid):
    result = studentsCollection.update_one(
        {"orgdefinedid" : orgdefinedid}, 
        {"$set" : {
            "group": None,
            "group_number": None  # Add the group number to the student document
        }
        }
    )
    return result

def bulk_group_update_students_by_ids(student_ids, new_group):
    try:
        updated_count = 0
        
        for student_id in student_ids:
            student = get_student_by_id(student_id)
            orgdefinedid = student["orgdefinedid"]
            student_old_group = student["group"]
            student_email = student["email"]
            
            # remove the student from the group, if it exists
            if student_old_group != '' and student_old_group != None:
                group.bulk_remove_students_from_group(student_old_group, orgdefinedid)
                
            if new_group != 'null':
                # add the student to the new groupgroup_id
                group.add_student_to_group_by_group_id(student_email, new_group)
            else:
                # set the group to null for the students
                remove_student_from_group(orgdefinedid)
            
            updated_count += 1
        
        return updated_count
    
    except Exception as e:
        raise e
    

def delete_students_by_ids(student_ids):
    try:
        deleted_count = 0

        for student_id in student_ids:
            # Call the existing delete_student_by_id function for each ID
            result = delete_student_by_id(student_id)

            # Check if the deletion was successful
            if result == "works":
                _ = user.delete_user_by_id(student_id) # remove the related user too
                deleted_count += 1

        return deleted_count

    except Exception as e:
        raise e

def delete_student_by_id(a):
    try:
        student_to_delete = get_student_by_id(a)
        if student_to_delete is not None:
            # Check if the student is in a group and try to remove them
            group_id = student_to_delete.get("group")
            # if group_id is not None and group_id != "":
            #     orgdefinedid = student_to_delete["orgdefinedid"]
            #     result = group.remove_student_from_group(group_id, orgdefinedid)
            #     if not result:
            #         return {"message": f"Failed to remove student {orgdefinedid} from the group."}, 500
 
            # Delete the student document
            result = studentsCollection.delete_one({"_id": ObjectId(a)})

            if result.deleted_count > 0:
                return "works"
            else:
                return "not works"
        else:
            return "not works"

    except Exception as e:
        raise e

# this function can be removed when individual table imports are deprecated
def import_students(file, accessor_keys):
    if not file or not file.filename:
        return "No file selected", 400

    file_extension = file.filename.rsplit(".", 1)[1]
    if file_extension == "xlsx":
        data = pd.read_excel(file, na_values=["N/A", "na", "--", "NaN", " "])
        data.columns = data.columns.str.lower()
    elif file_extension == "csv":
        data = pd.read_csv(file, na_values=["N/A", "na", "--", "NaN", " "])
        data.columns = data.columns.str.lower()
        # data.columns = [col.replace(" ", "") for col in data.columns]
    else:
        return "Invalid file format", 400

    excel_headers = data.columns.to_list()
    excel_headers.pop()

    for i in range(len(excel_headers)):
        excel_headers[i] = excel_headers[i].lower().replace( " ", "" )
    for i in range(len(accessor_keys)):
        accessor_keys[i] = accessor_keys[i].lower().replace( " ", "" )

    missing_columns = []
    for i in excel_headers:
        if i not in accessor_keys:
            missing_columns.append(i)
    
    if len(missing_columns) != 0:
        return f"Column(s) not found in file: {', '.join(missing_columns)}", 400

    data_json = data.to_json(orient="records")
    cleaned_data = clean_up_json_data(data_json)
    return cleaned_data