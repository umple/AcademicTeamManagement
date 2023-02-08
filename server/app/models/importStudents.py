from flask import request
from flask_restful import Resource
import pandas as pd
import openpyxl


class ImportStudents(Resource):
    def post(self):
        file = request.files["file"]
        if not file:
            return "No file selected", 400
        if file:
            file_extension = file.filename.rsplit(".", 1)[1]
            if file_extension == "xlsx":
                data = pd.read_excel(file,na_values=["N/A", "na", "--","NaN", " "])
                return data.to_json(orient="records")
            elif file_extension == "csv":
                data = pd.read_csv(file,na_values=["N/A", "na", "--","NaN", " "])
                return data.to_json(orient="records")
            else:
                return "Could not convert file", 503
        else:
            return "Could not read file", 500