from flask_restful import Resource
from pymongo import MongoClient
from bson.objectid import ObjectId
import os

client = MongoClient("mongodb://localhost", os.getenv("MONGO"))
# currently hard coded database and collection called fruits
mydb = client["fruits"]
mycol = mydb["fruits"]

class Students(Resource):
    def get(self):
        return list(mycol.find())

    def post(self, name):
        mycol.insert_one({'name':name})
        return self.get()
        
class Student(Resource):
    def get(self, id):
        return list(mycol.find({"_id" : ObjectId(id)}))
    
    def put(self, id, name):
        mycol.update_one({"_id" : ObjectId(id)},{'name':name})
        return list(mycol.find())
    
    def delete(self, id):
        mycol.delete_one({"_id" : ObjectId(id)})
        return list(mycol.find())