from flask_restful import Api
from routes.student import StudentAPI, StudentsAPI
from routes.importStudents import ImportStudentsAPI


def initialize_routes(api: Api):
    # Student routes
    api.add_resource(StudentAPI, '/student/<int:id>')
    api.add_resource(StudentsAPI, '/student')

    # Import students routes
    api.add_resource(ImportStudentsAPI, '/import-excel')
