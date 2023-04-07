from .__init__ import db
from bson import ObjectId
from app.utils.data_conversion import clean_up_json_data
import pandas as pd
from flask import jsonify

studentsCollection = db["students"]

def get_all_student():
    student_list = []
    for document in studentsCollection.find():
        document["_id"] = str(document["_id"])
        student_list.append(document)
    return student_list

def add_student(student_obj):
    if (get_student_by_username(student_obj["username"] ) == None):
        result = studentsCollection.insert_one(student_obj)
        return result
    return None

def add_import_student(student_obj):
    studentsCollection.insert_one(student_obj)
   
def get_student_by_id(id):
    document = studentsCollection.find_one({"_id": ObjectId(id)})
    document["_id"] = str(document["_id"])
    return document

def get_student_by_username(username):
    document = studentsCollection.find_one({"username": str(username)})
    if document:
        username_field = document.get("username")
        if isinstance(username_field, str):
            document["username"] = str(username_field)
    return document

def update_student_by_id(id, student_obj):
    result = studentsCollection.replace_one({"_id": ObjectId(id)}, student_obj)
    return result

def delete_student_by_id(id):
    result = studentsCollection.delete_one({"_id": ObjectId(id)})
    return result



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
        data.columns = [col.replace(" ", "") for col in data.columns]
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