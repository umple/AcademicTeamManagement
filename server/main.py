from flask_restful import Api
from routes.student import StudentAPI, StudentsAPI
from routes.excelImport import ExcelImportAPI



def initialize_routes(api: Api):
    # User routes
    api.add_resource(StudentAPI, '/student/<int:id>')
    api.add_resource(StudentsAPI, '/student')
    api.add_resource(ExcelImportAPI, '/import-excel')
