from flask import jsonify, request
from unittest.mock import MagicMock
from app.controllers.student_controller import get_students, add_student, get_student_by_id, update_student_by_id, delete_student_by_id
from app.models import student
from bson import ObjectId
import unittest


class TestStudentController(unittest.TestCase):

    def test_get_students(self):
        # Create a mock student list
        student_list = [{'name': 'John Doe', 'age': 20}, {'name': 'Jane Doe', 'age': 22}]
        
        # Create a mock get_all_student() function
        student.get_all_student = MagicMock(return_value=student_list)
        
        # Call the get_students() function
        response, status_code = get_students()
        
        # Assertions
        self.assertEqual(status_code, 200)
        self.assertEqual(response, jsonify(student_list))
        student.get_all_student.assert_called_once()
    
    def test_add_student(self):
        # Define a sample student object
        student_obj = {'name': 'John Doe', 'age': 20}
        
        # Create a mock add_student() function
        result = MagicMock()
        result.inserted_id = ObjectId()
        student.add_student = MagicMock(return_value=result)
        
        # Call the add_student() function
        response, status_code = add_student()
        
        # Assertions
        self.assertEqual(status_code, 201)
        self.assertEqual(response, jsonify(str(result.inserted_id)))
        student.add_student.assert_called_once_with(student_obj)
        
    def test_get_student_by_id(self):
        # Define a sample student object
        student_obj = {'name': 'John Doe', 'age': 20}
        
        # Create a mock get_student_by_id() function
        student.get_student_by_id = MagicMock(return_value=student_obj)
        
        # Call the get_student_by_id() function
        response, status_code = get_student_by_id(str(ObjectId()))
        
        # Assertions
        self.assertEqual(status_code, 200)
        self.assertEqual(response, jsonify(student_obj))
        student.get_student_by_id.assert_called_once()
    
    def test_update_student_by_id(self):
        # Define a sample student object
        student_obj = {'name': 'John Doe', 'age': 20}
        
        # Create a mock update_student_by_id() function
        result = MagicMock()
        result.modified_count = 1
        student.update_student_by_id = MagicMock(return_value=result)
        
        # Call the update_student_by_id() function
        response, status_code = update_student_by_id(str(ObjectId()), student_obj)
        
        # Assertions
        self.assertEqual(status_code, 200)
        self.assertEqual(response, jsonify(str(result.modified_count)))
        student.update_student_by_id.assert_called_once_with(str(ObjectId()), student_obj)
    
    def test_delete_student_by_id(self):
        # Create a mock delete_student_by_id() function
        result = MagicMock()
        result.deleted_count = 1
        student.delete_student_by_id = MagicMock(return_value=result)
        
        # Call the delete_student_by_id() function
        response, status_code = delete_student_by_id(str(ObjectId()))
        
        # Assertions
        self.assertEqual(status_code, 200)
        self.assertEqual(response, jsonify(str(result.deleted_count)))
        student.delete_student_by_id.assert_called_once_with(str(ObjectId()))
