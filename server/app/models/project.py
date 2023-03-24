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
    result = projectCollection.insert_one({"project":"asdfasdf"})
    return result
