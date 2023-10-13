from .__init__ import db
from bson import ObjectId
from app.utils.data_conversion import clean_up_json_data
import app.models.group as group
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
    # CHECKS FOR EXISTING USER
    if (get_student_by_username(student_obj.username ) == None):
        student_obj.group = None
        result = studentsCollection.insert_one(student_obj.to_json())
        return result
    return None

def add_import_student(student_obj):
    student_obj["group"] = None
    student_obj["professorEmail"] = session.get("user")["preferred_username"]
    studentsCollection.insert_one(student_obj)

def get_student_by_id(id):
    document = studentsCollection.find_one({"_id": ObjectId(id)})
    document["_id"] = str(document["_id"])
    return document

def get_student_by_email(email):
    document = studentsCollection.find_one({"email": email})
    document["email"] = str(document["email"])
    return document

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

def update_student_by_id(id, student_obj):
    result = studentsCollection.update_one({"_id": ObjectId(id)}, {
        "$set":student_obj
    })
    return result

def assign_group_to_student(orgdefinedid, groupName):
    result = studentsCollection.update_one(
        {"orgdefinedid" : orgdefinedid}, 
        {"$set" : {
            "group": groupName
        }
        }
    )
    return result

def remove_student_from_group(orgdefinedid):
    result = studentsCollection.update_one(
        {"orgdefinedid" : orgdefinedid}, 
        {"$set" : {
            "group": None
        }
        }
    )
    return result

def delete_student_by_id(id):
    try:
        student_to_delete = get_student_by_id(id)
        print(student_to_delete)

        if student_to_delete is not None:
            # Check if the student is in a group and try to remove them
            if student_to_delete.get("group") != "" or student_to_delete.get("group") is not None :
                group_id = student_to_delete["group"]
                orgdefinedid = student_to_delete["orgdefinedid"]
                result = group.remove_student_from_group(group_id, orgdefinedid)
                if not result:
                    return {"message": f"Failed to remove student {orgdefinedid} from the group."}, 500

            # Delete the student document
            result = studentsCollection.delete_one({"_id": ObjectId(id)})

            if result.deleted_count > 0:
                return {"message": f"Student with ID {id} deleted successfully."}, 200
            else:
                return {"message": f"Student with ID {id} not found."}, 404
        else:
            return {"message": f"Student with ID {id} not found."}, 404

    except Exception as e:
        raise e


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
