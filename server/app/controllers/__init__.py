from flask import Blueprint

student_bp = Blueprint('student', __name__,url_prefix='/api')
project_bp = Blueprint('project',__name__,url_prefix='/api')
group_bp = Blueprint('group',__name__,url_prefix='/api')
section_bp = Blueprint('section', __name__, url_prefix='/api')
project_application_bp = Blueprint('projectApplication',__name__,url_prefix='/api')


from . import student_controller, project_controller, group_controller, section_controller, project_application_controller
