from flask_restful import Resource
from flask import jsonify
from pymongo import MongoClient, errors
from bson.objectid import ObjectId
import os
# , int(os.getenv("MONGO"))

client = MongoClient("mongodb://localhost/27017")
#currently hard coded database and collection called fruits
class Projects(Resource):
    def get(self):
        try:
            mydb = client["Projects"]
            mycol = mydb["Projects"]
            mycol.insert_one({ 'project':"fdsfsd",'description': "gfdsgdsf"})
            documents = mycol.find()
            response = {'documents': documents}
            return jsonify(response)
        except errors.ServerSelectionTimeoutError as e:
            print('Could not connect to MongoDB:', e)
            return 'Could not connect to MongoDB', 500

    def post(self):
        project = 'Potential project A: Mobile pre-surgery app for CHEO'
        description = 'The customers write "Dr. Byrns and I started collaborating a few years ago on a mobile application to help teenagers and parents of kids awaiting surgery at CHEO better comply with fasting instructions and illness reporting in order to avoid (expensive) surgery cancellations. We have a good working Android prototype already and will have a pilot study deployed shortly.'
        mycol.insert_one({ 'project':project,
        'description': description})
        return self.get()

