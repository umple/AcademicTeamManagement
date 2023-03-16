from flask import Blueprint

student_bp = Blueprint('student', __name__)

from . import student_controller
