from flask_restful import Resource, reqparse
from app.controllers.importStudents import ImportStudents as ImportStudentsController
import json

class ImportStudentsAPI(Resource):
    def __init__(self):
        super(ImportStudentsAPI, self).__init__()

    def post(self):
        return json.loads(ImportStudentsController.post(self)[0]), 201
