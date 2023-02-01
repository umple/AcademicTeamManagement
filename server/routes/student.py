from flask_restful import Resource, reqparse
from app.controllers.student import Student as StudentController, Students as StudentsController

class StudentAPI(Resource):
    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('name', type=str, location='json')
        super(StudentAPI, self).__init__()
    
    def get(self, id):
        return StudentController.get(self, id)
    
    def put(self, id):
        return StudentController.put(self, id)
    
    def delete(self, id):
        return StudentController.delete(self, id)

class StudentsAPI(Resource):
    def __init__(self):
        super(StudentsAPI, self).__init__()

    def get(self):
        return StudentsController.get(self)

    def post(self):
        return StudentsController.post(self)
    
    def importExcelStudentInformation(self):
        return StudentsController.importExcelStudentInformation(self)