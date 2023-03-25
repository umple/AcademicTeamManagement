from flask import Blueprint

student_bp = Blueprint('student', __name__)
project_bp = Blueprint('project',__name__,url_prefix='/api')

from . import student_controller, project_controller
