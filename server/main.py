from flask_restful import Api
from routes.student import StudentAPI, StudentsAPI
from routes.importStudents import ImportStudentsAPI
from security.auth import AuthenticationAPI


def initialize_routes(api: Api):
    # Student routes
    api.add_resource(StudentAPI, '/api/student/<int:id>')
    api.add_resource(StudentsAPI, '/api/student')

    # Import students routes
    api.add_resource(ImportStudentsAPI, '/api/import-excel')

    # Import security
    api.add_resource(AuthenticationAPI, '/api/login')
