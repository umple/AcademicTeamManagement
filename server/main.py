from flask_restful import Api
from flask import Flask

from app.controllers import student_controller, project_controller, group_controller


def initialize_routes(app: Flask, api: Api):
    # routes
    app.register_blueprint(student_controller.student_bp)
    app.register_blueprint(project_controller.project_bp)
    app.register_blueprint(group_controller.group_bp)
