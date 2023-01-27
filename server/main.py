from flask_restful import Api
from routes.student import StudentAPI, StudentsAPI


def initialize_routes(api: Api):
    # User routes
    api.add_resource(StudentAPI, '/student/<int:id>')
    api.add_resource(StudentsAPI, '/student')
