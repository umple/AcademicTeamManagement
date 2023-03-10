from flask import request
from flask_restful import Resource
from app.models.project import Projects as ProjectModel

class Projects(Resource):
    def get(self):
        projects = ProjectModel.get(self)
        if projects:
            return {"Projects": projects}
        else:
            return {"message": "Students list not found."}, 404

    def post(self):
        data = request.json
        print('Hello, world!')
        projects = ProjectModel.post(self)
        if projects:
            return {"Projects": projects}, 201
        else:
            return {"message": "PROJECTSS NOT FOUND."}, 404


