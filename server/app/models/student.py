from . import db
from bson import ObjectId

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

def get_student_by_id(id):
    document = studentsCollection.find_one({"_id": ObjectId(id)})
    document["_id"] = str(document["_id"])
    return document

def update_student_by_id(id, student_obj):
    result = studentsCollection.replace_one({"_id": ObjectId(id)}, student_obj)
    return result

def delete_student_by_id(id):
    result = studentsCollection.delete_one({"_id": ObjectId(id)})
    return result
