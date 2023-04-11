from flask import Flask

from app.controllers import student_controller, project_controller, group_controller, project_application_controller


def initialize_routes(app: Flask):
    # routes
    app.register_blueprint(student_controller.student_bp)
    app.register_blueprint(project_controller.project_bp)
    app.register_blueprint(group_controller.group_bp)
    app.register_blueprint(project_application_controller.project_application_bp)
