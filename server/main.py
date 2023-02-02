from flask import Flask, request, jsonify
import openpyxl
from flask_restful import Api
from routes.student import StudentAPI, StudentsAPI
import pandas as pd

app = Flask(__name__)

def initialize_routes(api: Api):
    # User routes
    api.add_resource(StudentAPI, '/student/<int:id>')
    api.add_resource(StudentsAPI, '/student')


@app.route("/import-excel", methods=["POST"])
def import_excel():
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

if __name__ == "__main__":
    app.run()