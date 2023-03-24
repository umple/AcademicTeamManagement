from flask_restful import Resource, reqparse
from app.controllers.homePage_controller import HomePage as homePageController


class HomePageAPI(Resource):
    def __init__(self):
        super(HomePageAPI, self).__init__()

    def get(self):
        return homePageController.get(self), 201
