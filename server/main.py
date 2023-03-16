from flask_restful import Api
from flask import Flask
from routes.importStudents import ImportStudentsAPI
from app.controllers import student_controller


def initialize_routes(app: Flask, api: Api):
    # Student routes
    app.register_blueprint(student_controller.student_bp)

    # Import students routes
    api.add_resource(ImportStudentsAPI, '/api/import-excel')
