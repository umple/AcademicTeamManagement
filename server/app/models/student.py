from .__init__ import db
from bson import ObjectId
from app.utils.data_conversion import clean_up_json_data
import pandas as pd

studentsCollection = db["students"]

def get_all_student():
    student_list = []
    for document in studentsCollection.find():
        document["_id"] = str(document["_id"])
        student_list.append(document)
    return student_list

def add_student(student_obj):
    result = studentsCollection.insert_one(student_obj)
    return result

def add_import_student(student_obj):
    studentsCollection.insert_one(student_obj)
   
def get_student_by_id(id):
    document = studentsCollection.find_one({"_id": ObjectId(id)})
    document["_id"] = str(document["_id"])
    return document

def get_student_by_email(email):
    document = studentsCollection.find_one({"Email": str(email)})
    if document:
        email_field = document.get("Email")
        if isinstance(email_field, str):
            document["Email"] = str(email_field)
 
    return document

def update_student_by_id(id, student_obj):
    result = studentsCollection.replace_one({"_id": ObjectId(id)}, student_obj)
    return result

def delete_student_by_id(id):
    result = studentsCollection.delete_one({"_id": ObjectId(id)})
    return result

def import_students(file):
    if not file:
        return "No file selected", 400
    if file:
        file_extension = file.filename.rsplit(".", 1)[1]
        if file_extension == "xlsx":
            data = pd.read_excel(file,na_values=["N/A", "na", "--","NaN", " "])
            data = clean_up_json_data(data.to_json(orient="records"))
            return data
        elif file_extension == "csv":
            data = pd.read_csv(file,na_values=["N/A", "na", "--","NaN", " "])
            data = clean_up_json_data(data.to_json(orient="records"))
            return data
        else:
            return "Could not convert file", 503
    else:
        return "Could not read file", 500
