import unittest
from unittest.mock import MagicMock
from bson import ObjectId
import student
from .__init__ import db

class TestStudentModel(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        # Create a mock database object
        cls.mock_db = MagicMock()
        db.studentsCollection = cls.mock_db
    
    @classmethod
    def tearDownClass(cls):
        # Clean up the mock database
        cls.mock_db.drop()
    
    def test_add_student(self):
        # Create a test student object
        test_student = {
            "name": "John Doe",
            "age": 21,
            "major": "Computer Science"
        }
        # Add the test student to the database
        result = student.add_student(test_student)
        # Check that the insert was successful
        self.assertTrue(result.inserted_id)
    
    def test_get_student_by_id(self):
        # Create a test student object
        test_student = {
            "name": "John Doe",
            "age": 21,
            "major": "Computer Science"
        }
        # Add the test student to the database
        result = student.add_student(test_student)
        # Get the ID of the test student
        student_id = str(result.inserted_id)
        # Get the test student from the database by ID
        retrieved_student = student.get_student_by_id(student_id)
        # Check that the retrieved student is the same as the test student
        self.assertEqual(retrieved_student["name"], test_student["name"])
        self.assertEqual(retrieved_student["age"], test_student["age"])
        self.assertEqual(retrieved_student["major"], test_student["major"])
    
    def test_update_student_by_id(self):
        # Create a test student object
        test_student = {
            "name": "John Doe",
            "age": 21,
            "major": "Computer Science"
        }
        # Add the test student to the database
        result = student.add_student(test_student)
        # Get the ID of the test student
        student_id = str(result.inserted_id)
        # Create a new student object to update the test student
        updated_student = {
            "name": "Jane Doe",
            "age": 22,
            "major": "Mathematics"
        }
        # Update the test student in the database
        result = student.update_student_by_id(student_id, updated_student)
        # Check that the update was successful
        self.assertEqual(result.modified_count, 1)
        # Get the test student from the database by ID
        retrieved_student = student.get_student_by_id(student_id)
        # Check that the retrieved student is the same as the updated student
        self.assertEqual(retrieved_student["name"], updated_student["name"])
        self.assertEqual(retrieved_student["age"], updated_student["age"])
        self.assertEqual(retrieved_student["major"], updated_student["major"])
    
    def test_delete_student_by_id(self):
        # Create a test student object
        test_student = {
            "name": "John Doe",
            "age": 21,
            "major": "Computer Science"
        }
        # Add the test student to the database
        result = student.add_student(test_student)
        # Get the ID of the test student
        student_id = str(result.inserted_id)
        # Delete the test student from the database by ID
        result = student.delete_student_by_id(student_id)
        # Check that the delete was successful
        self.assertEqual(result.deleted_count, 1)
        # Try to get
