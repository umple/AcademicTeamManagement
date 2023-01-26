from flask import Flask, request
from flask_restful import Resource, Api

app = Flask(__name__)
api = Api(app)

fakeDatabase = {
    1:{'name':'jack'},
    2:{'name':'john'},
    3:{'name':'james'},
}

class Students(Resource):
    def get(self):
        return fakeDatabase

    def post(self):
        data = request.json
        itemId = len(fakeDatabase.keys()) + 1
        fakeDatabase[itemId] = {'name':data['name']}
        return fakeDatabase

class Student(Resource):
    def get(self, pk:int):
        return fakeDatabase[pk]
    
    def put(self, pk):
        data = request.json
        fakeDatabase[pk]['name'] = data['name']
        return fakeDatabase
    
    def delete(self, pk):
        del fakeDatabase[pk]
        return {
            "Request": "DELETE",
            "Database": fakeDatabase
        }

    
api.add_resource(Students, '/')
api.add_resource(Student, '/<int:pk>')

if __name__ == '__main__':
    app.run(debug=True)