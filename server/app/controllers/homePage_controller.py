from flask import request
from flask_restful import Resource
from flask import Flask, redirect, session

class HomePage(Resource):
    def get(self):
        user = []
        if session.get("state") != None:
            user = session["state"]
        return "hello"