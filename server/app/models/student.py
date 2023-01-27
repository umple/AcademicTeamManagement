from flask import request
from flask_restful import Resource

fakeDatabase = {
    1:{'name':'jack'},
    2:{'name':'john'},
    3:{'name':'james'},
}

class Students(Resource):
    def get(self):
        return fakeDatabase

    def post(self, name):
        itemId = len(fakeDatabase.keys()) + 1
        fakeDatabase[itemId] = {'name':name}
        return fakeDatabase

class Student(Resource):
    def get(self, id):
        return fakeDatabase[id]
    
    def put(self, id, name):
        fakeDatabase[id]['name'] = name
        return fakeDatabase
    
    def delete(self, id):
        del fakeDatabase[id]
        return  fakeDatabase