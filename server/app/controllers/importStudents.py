from flask import request
from flask_restful import Resource
from app.models.importStudents import ImportStudents as ImportStudentsModel

class ImportStudents(Resource):
    def post(self):
        data = ImportStudentsModel.post(self)
        if data:
            return data, 201
        else:
            return {"message": "Importing students list failed"}, 404