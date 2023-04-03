from flask_restful import Api
from flask import Flask
# from routes.importStudents import ImportStudentsAPI
from security.auth import AuthenticationAPI
from app.controllers import student_controller, project_controller


def initialize_routes(app: Flask, api: Api):
    # Student routes
    app.register_blueprint(student_controller.student_bp)
    app.register_blueprint(project_controller.project_bp)

    # Import students routes
    # api.add_resource(ImportStudentsAPI, '/api/import-excel')
    # Import security
    api.add_resource(AuthenticationAPI, '/api/login')