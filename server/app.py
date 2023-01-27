from flask import Flask, request
from flask_restful import Resource, Api
from routes.student import StudentAPI, StudentsAPI

app = Flask(__name__)
api = Api(app)

    
api.add_resource(StudentsAPI, '/student')
api.add_resource(StudentAPI, '/student/<int:id>')

if __name__ == '__main__':
    app.run(debug=True)