from flask_restful import Api
from routes.student import StudentAPI, StudentsAPI
from routes.importStudents import ImportStudentsAPI
from routes.projects import ProjectsAPI

def initialize_routes(api: Api):
    # Student routes
    api.add_resource(StudentAPI, '/api/student/<int:id>')
    api.add_resource(StudentsAPI, '/api/student')
    api.add_resource(ProjectsAPI, '/api/add/project')

    # Import students routes
    api.add_resource(ImportStudentsAPI, '/api/import-excel')
