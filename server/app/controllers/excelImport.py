from flask import request
from flask_restful import Resource
import pandas as pd
import openpyxl

class ExcelImport(Resource):
    # @app.route("/import-excel", methods=["POST"])
    def post(self):
  
        file = request.files["file"]
        print(file)
        if not file:
             print('LAITH')
             return "No file selected", 400
        data = pd.read_excel(file,na_values=["N/A", "na", "--","NaN", " "])
        print(data)
        # return data.to_json(orient="records")
