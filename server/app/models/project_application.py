from .__init__ import db
from bson import ObjectId

projectApplicationCollection = db["projectApplications"]

def get_all_project_application():
    project_application_list = []
    for document in projectApplicationCollection.find():
        document["_id"] = str(document["_id"])
        project_application_list.append(document)
    return project_application_list

def add_project_application(project_obj):
    result = projectApplicationCollection.insert_one(project_obj)
    return result



