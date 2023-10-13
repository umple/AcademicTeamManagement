import unittest
from flask import session
from app.models import student
from app.entities.StudentEntity import StudentEntity
from werkzeug.datastructures import FileStorage
from bson import ObjectId
import json
import copy
from run import app as flask_app 

class StudentDataManager:
    def getStudent():

        student_json_sample = {    
            "_id": ObjectId(),
            "orgdefinedid": "1234",
            "username": "1234user",
            "lastname": "Doe",
            "firstname": "jane",
            "email": "janedoe@gmail.com",
            "sections": None,
            "final grade": None,
            "group": None
        }

        return student_json_sample

class TestStudentRetrival(unittest.TestCase):
    def setUp(self):
        # Add student to mock
        self.student = StudentDataManager.getStudent()
        student.studentsCollection.insert_one(self.student)

    def tearDown(self):
        student.studentsCollection.delete_many({})
            
    def test_retrive_with_students(self):
        expected = self.student
        actual = student.get_all_student()
        for key in list(expected):
            if (key != "_id"):
                self.assertEqual(actual[0][key], expected[key])
    # def test_get_student_by_id(self):
    #     expected = self.student
    #     actual = student.get_student_by_id(expected["_id"])
    #     for key in list(expected):
    #         if (key != "_id"):
    #             self.assertEqual(actual[key], expected[key])

    # def test_get_student_by_invalid_id(self):
    #     with self.assertRaises(TypeError):
    #         student.get_student_by_id(ObjectId())
    
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

    def test_get_student_by_username(self):
        expected = self.student
        actual = student.get_student_by_username("1234user")
        self.assertDictEqual(actual, expected)

    def test_retrive_empty_student_list(self):
        #  clear the db
        student.studentsCollection.delete_many({})
        # define test parameters
        actual = student.get_all_student()
        excepted = []
        # Assertion condition
        self.assertEqual(actual, excepted)




class TestStudentAddition(unittest.TestCase):
    def tearDown(self):
        student.studentsCollection.delete_many({})

    def test_add_student(self):
        studentObj = StudentEntity(StudentDataManager.getStudent())
        actual = student.add_student(studentObj)
        self.assertTrue(actual)

    # def test_add_student_duplicate(self):
    #     studentObj = StudentEntity(StudentDataManager.getStudent())
    #     student.studentsCollection.insert_one(studentObj.to_json())

    #     # assert the second addition is not allowed
    #     actual = student.add_student(studentObj)
    #     self.assertIsNone(actual)

    def test_import_student(self):        
        try:
            studentObj = StudentDataManager.getStudent()
            with flask_app.test_request_context():
                session['user'] = {"preferred_username": "test_user"}
                student.add_import_student(studentObj)
        except Exception:
            self.fail("Exception occured when importing student")

    def test_import_xlsx_file(self):
        test_file = None
        expected = StudentDataManager.getStudent()
        with open('tests/resources/Files/import_student.xlsx', 'rb') as fp:
            test_file = FileStorage(fp)
            accessor_keys = ["OrgDefinedId", "username", "last name", "first name", "email", "sections", "final grade"]
            actual = json.loads(student.import_students(test_file, accessor_keys))
        for key in list(actual[0]):
            if (key != "_id"):
                self.assertEqual(actual[0][key], expected[key])
    
    def test_import_csv_file(self):
        test_file = None
        expected = StudentDataManager.getStudent()
        with open('tests/resources/Files/import_student.csv', 'rb') as fp:
            test_file = FileStorage(fp)
            accessor_keys = ["OrgDefinedId", "username", "last name", "first name", "email", "sections", "finalgrade"]
            actual = json.loads(student.import_students(test_file, accessor_keys))
        for key in list(actual[0]):
            if (key != "_id"):
                self.assertEqual(actual[0][key], expected[key])
    
    def test_import_student_bad_keys(self):
        test_file = None
        expected = StudentDataManager.getStudent()
        with open('tests/resources/Files/import_student.xlsx', 'rb') as fp:
            test_file = FileStorage(fp)
            accessor_keys = ["bad key"]
            _ , status = student.import_students(test_file, accessor_keys)
        self.assertEqual(400, status)
    
    def test_import_invalid_file_format(self):
        test_file = None
        with open('tests/resources/Files/import_student.pdf', 'rb') as fp:
            test_file = FileStorage(fp)
            accessor_keys = ["OrgDefinedId", "username", "last name", "first name", "email", "sections", "finalgrade"]
            message, status = student.import_students(test_file, accessor_keys)
        self.assertEqual(message, "Invalid file format")
        self.assertEqual(status, 400)
    
    def test_import_nullt(self):
        test_file = None
        message, status = student.import_students(test_file, [])
        self.assertEqual(message, "No file selected")
        self.assertEqual(status, 400)
        

class TestStudentModification(unittest.TestCase):
    def setUp(self):
        self.student = StudentDataManager.getStudent()
        student.studentsCollection.insert_one(self.student)

    def tearDown(self):
        student.studentsCollection.delete_many({})
    
    # def test_update_student_by_id(self):
    #     # Make edits to student
    #     exceptedStudent = copy.deepcopy(self.student)
    #     exceptedStudent["firstname"] = "mock"
    #     exceptedStudent["lastname"] = "student"
    #     exceptedStudent["final grade"] = "A+"
        
    #     # ensure that the change is true
    #     actual = student.update_student_by_id(self.student["_id"], exceptedStudent)
    #     self.assertTrue(actual)

    #     #validate keys
    #     actualStudent = student.studentsCollection.find_one({"orgdefinedid": str(exceptedStudent["orgdefinedid"])})
    #     self.assertDictEqual(actualStudent, exceptedStudent)
    
    def test_assign_group_to_student(self):
        actual = student.assign_group_to_student(self.student["orgdefinedid"], "Mock Group")
        self.assertTrue(actual)

        #validate group name is correct
        actualGroup = student.studentsCollection.find_one({"orgdefinedid": str(self.student["orgdefinedid"])})["group"]
        self.assertEqual("Mock Group", actualGroup)

    def test_remove_student_from_group(self):
        student.studentsCollection.update_one(
            {"orgdefinedid" : self.student["orgdefinedid"]}, 
            {"$set" : {
            "group": "Not This group"
            }
            }
        )
        actual = student.remove_student_from_group(self.student["orgdefinedid"])
        self.assertTrue(actual)

        #validate group is None
        actualGroup = student.studentsCollection.find_one({"orgdefinedid": str(self.student["orgdefinedid"])})["group"]
        self.assertIsNone(actualGroup)

class TestStudentDeletion(unittest.TestCase):
    def setUp(self):
        self.student = StudentDataManager.getStudent()
        student.studentsCollection.insert_one(self.student)

    def tearDown(self):
        student.studentsCollection.delete_many({})
    
    def test_delete_student_with_no_group(self):
        response = student.delete_student_by_id(self.student["_id"])
        self.assertTrue(response)

        actualState = student.studentsCollection.find_one({"orgdefinedid": str(self.student["orgdefinedid"])})
        self.assertIsNone(actualState)
    
    def test_delete_student_with__group(self):
        student.studentsCollection.update_one(
            {"orgdefinedid" : self.student["orgdefinedid"]}, 
            {"$set" : {
            "group": "Mock"
            }
            }
        )
        with self.assertRaises(TypeError):
            response = student.delete_student_by_id(self.student["_id"])
            self.assertFalse(response)





