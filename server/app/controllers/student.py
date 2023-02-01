from flask import request, Flask
from flask_restful import Resource
from app.models.student import Student as StudentModel, Students as StudentsListModel
from flask import request
import pandas as pd
import openpyxl
from flask import app

class Students(Resource):
    def get(self):
        students = StudentsListModel.get(self)
        if students:
            return {"students": students}
        else:
            return {"message": "Students list not found."}, 404

    def post(self):
        data = request.json
        students = StudentsListModel.post(self,**data)
        return {"students": students}, 201
    
    @app.route("/import-excel", methods=["POST"])
    def importExcelStudentInformation(self):
        print("here")
        file = request.files["file"]
        if not file:
            return "No file selected", 400
        data = pd.read_excel(file,na_values=["N/A", "na", "--","NaN", " "])
        return data.to_json(orient="records")

class Student(Resource):
    def get(self, id):
        student = StudentModel.get(self,id)
        if student:
            return {"student": student}
        else:
            return {"message": "Student not found."}, 404

    def put(self, id):
        data = request.json
        student = StudentModel.get(self, id)
        if student:
            students = StudentModel.put(self, id, **data)
            return {"students": students}, 200
        else:
            return {"message": "Student not found."}, 404

    def delete(self, id):
        student = StudentModel.get(self, id)
        if student:
            students = StudentModel.delete(self, id)
            return {"students": students}, 200
        else:
            return {"message": "Student not found."}, 404
    