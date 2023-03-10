from flask_restful import Resource, reqparse
from app.controllers.projects import Projects as ProjectsController

class ProjectsAPI(Resource):
    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('name', type=str, location='json')
        super(ProjectsAPI, self).__init__()
    
    def get(self):
        return ProjectsController.get(self)
    def post(self):
        return ProjectsController.post(self)
    
