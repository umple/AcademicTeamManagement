from flask import jsonify, request
from app.models import project
from bson import ObjectId
from . import user_bp


# GET Request to retreive all students from the collection
# @user_bp.route("/addUser", methods=["POST"])
# def add_user():

 