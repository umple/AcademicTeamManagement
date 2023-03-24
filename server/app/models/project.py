from .__init__ import db
from bson import ObjectId

projectCollection = db["projects"]

def get_all_projects():
    project_list = []
    for document in projectCollection.find():
        document["_id"] = str(document["_id"])
        project_list.append(document)
    return project_list

def add_project(project_obj):
    result = projectCollection.insert_one(project_obj)
    return result

def update_project_by_id(id, project_obj):
    result = projectCollection.replace_one({"_id": ObjectId(id)}, project_obj)
    return result

def delete_project_by_id(id):
    doc_to_delete = projectCollection.find().skip(id).limit(1)
    print(doc_to_delete)
    result = projectCollection.delete_one(doc_to_delete)
    if result.deleted_count == 1:
        return "Document deleted successfully"
    else:
        return "Error deleting document"


