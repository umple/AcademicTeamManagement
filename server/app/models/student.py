from flask import request
from flask_restful import Resource
from pymongo import MongoClient
from bson.objectid import ObjectId

client = MongoClient("127.0.0.1",27017)
mydb = client["fruits"]
mycol = mydb["fruits"]

class Students(Resource):
    def get(self):
        return list(mycol.find())

    def post(self, name):
        mycol.insert_one({'name':name})
        return self.get()

#why do we even need this
#i mean i implemented it but still why
class Student(Resource):
    def get(self, id):
        return list(mycol.find({"_id" : ObjectId(id)}))
    
    def put(self, id, name):
        mycol.insert_one({"_id" : ObjectId(id),'name':name})
        return list(mycol.find())
    
    def delete(self, id):
        mycol.delete_one({"_id" : ObjectId(id)})
        return list(mycol.find())