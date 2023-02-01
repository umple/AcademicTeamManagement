from flask_restful import Resource, reqparse
from app.controllers.excelImport import ExcelImport
from flask import Flask


class ExcelImportAPI(Resource):
    def __init__(self):
        super(ExcelImportAPI, self).__init__()

    def post(self):
        return ExcelImport.post(self)
