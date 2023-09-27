import unittest
from app.models import student
import time
from bson import ObjectId

class StudentDataManager:
    def addStudent():
        studentSample = {    
            "_id": ObjectId(),
            "orgdefinedid": "1234",
            "username": "1234user",
            "lastname": "Doe",
            "firstname": "jane",
            "email": "janedoe@gmail.com",
            "sections": "",
            "final grade": "",
            "group": None
        }
        student.studentsCollection.insert_one(studentSample)
        return studentSample

class TestStudentRetrival(unittest.TestCase):
    def setUp(self):
        # Add student to mock
        self.student = StudentDataManager.addStudent()
    def tearDown(self):
        student.studentsCollection.delete_many({})
            
    def test_retrive_with_students(self):
        expected = self.student
        actual = student.get_all_student()
        for key in list(expected):
            if (key != "_id"):
                self.assertEqual(actual[0][key], expected[key])
    def test_get_student_by_id(self):
        expected = self.student
        actual = student.get_student_by_id(expected["_id"])
        for key in list(expected):
            if (key != "_id"):
                self.assertEqual(actual[key], expected[key])

    def test_get_student_by_invalid_id(self):
        with self.assertRaises(TypeError):
            student.get_student_by_id(ObjectId())
    
    def test_get_student_by_email(self):
        expected = self.student
        actual = student.get_student_by_email("janedoe@gmail.com")
        self.assertDictEqual(actual, expected)

    def test_get_student_by_invalid_email(self):
        with self.assertRaises(TypeError):
            student.get_student_by_email("mock@gmail.com")
    
    def test_get_student_name_from_valid_email(self):
        expected = self.student["firstname"] + " " + self.student["lastname"]
        actual = student.get_student_name_from_email("janedoe@gmail.com")
        self.assertEqual(actual, expected)

    def test_get_student_name_from_invalid_email(self):
        expected = "Invalid Email"
        actual = student.get_student_name_from_email("mock@gmail.com")
        self.assertEqual(actual, expected)

    def test_retrive_empty_student_list(self):
        #  clear the db
        student.studentsCollection.delete_many({})
        # define test parameters
        actual = student.get_all_student()
        excepted = []
        # Assertion condition
        self.assertEqual(actual, excepted)

        



