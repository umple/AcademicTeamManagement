import unittest
from unittest.mock import MagicMock
from __init__ import st
from app.models.__init__ import db
from bson import ObjectId


class TestStudentController(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        # Create a mock database object
        cls.mock_db = MagicMock()
        db.studentsCollection = cls.mock_db
    
    @classmethod
    def tearDownClass(cls):
        # Clean up the mock database
        cls.mock_db.drop()
    
    def test_get_students(self):
        # Mock the return value of student.get_all_student() function
        student_list = [{'name': 'John Doe', 'age': 20}, {'name': 'Jane Doe', 'age': 22}]
        student.get_all_student = MagicMock(return_value=student_list)
        
        # Make a GET request to the API endpoint
        response = self.app.test_client().get('/student')
        
        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, student_list)
        student.get_all_student.assert_called_once()
    
    def test_add_student(self):
        # Define a sample student object
        student_obj = {'name': 'John Doe', 'age': 20}
        
        # Make a POST request to the API endpoint
        response = self.app.test_client().post('/student', json=student_obj)
        
        # Assertions
        self.assertEqual(response.status_code, 201)
        self.assertIsInstance(ObjectId(response.json), ObjectId)
        student.add_student.assert_called_once_with(student_obj)
        
    def test_get_student_by_id(self):
        # Define a sample student object
        student_obj = {'name': 'John Doe', 'age': 20}
        
        # Mock the return value of student.get_student_by_id() function
        student.get_student_by_id = MagicMock(return_value=student_obj)
        
        # Make a GET request to the API endpoint
        response = self.app.test_client().get(f'/student/{str(ObjectId())}')
        
        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, student_obj)
        student.get_student_by_id.assert_called_once()
    
    def test_update_student_by_id(self):
        # Define a sample student object
        student_obj = {'name': 'John Doe', 'age': 20}
        
        # Mock the return value of student.update_student_by_id() function
        student.update_student_by_id = MagicMock(return_value=True)
        
        # Make a PUT request to the API endpoint
        response = self.app.test_client().put(f'/student/{str(ObjectId())}', json=student_obj)
        
        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, '1')
        student.update_student_by_id.assert_called_once()
    
    def test_delete_student_by_id(self):
        # Mock the return value of student.delete_student_by_id() function
        student.delete_student_by_id = MagicMock(return_value=True)
        
        # Make a DELETE request to the API endpoint
        response = self.app.test_client().delete(f'/student/{str(ObjectId())}')
        
        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, '1')
        student.delete_student_by_id.assert_called_once()
