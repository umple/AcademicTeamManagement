import unittest
from unittest.mock import patch
import app.models.group as group
import app.models.project as project
import app.models.student as student
from app.entities.GroupEntity import GroupEntity
from app.entities.ProjectEntity import ProjectEntity
from app.entities.StudentEntity import StudentEntity
from bson import ObjectId
import copy

class GroupDataManager:
    def getGroup():
        sample_group_id = ObjectId()
        group_json_sample = {
            "group_number": "1",
            "group_name": "Test Group",
            "assigned_project_id": None,
            "members": [],
            "notes": "Test Notes"
        }
        return GroupEntity(sample_group_id, group_json_sample)

    def getProject():
        sample_project_id = ObjectId()
        project_json_sample = {
            "project_name": "Test project",
        }
        return ProjectEntity(sample_project_id, project_json_sample)

    def getStudent():
        sample_student_id = ObjectId()
        student_json_sample = {
            'email': 'test@example.com',
            'first_name': 'John',
            'last_name': 'John',
            'is_admin': False,
            'section_ids': []
        }
        return StudentEntity(sample_student_id, student_json_sample)

class TestGroupRetrieval(unittest.TestCase):
    def setUp(self):
        # Add group to mock
        self.group = GroupDataManager.getGroup()
        group.add_group(self.group)

    def tearDown(self):
        group.groupCollection.delete_many({})

    # i have no clue what this test is trying to do.
    # actual is getallgroups but expected is one group?
    # i've got nothing
    # 
    # def test_retrieve_with_groups(self):
    #     expected = self.group
    #     actual = group.get_all_groups()
    #     for key in list(expected):
    #         if key != "_id":
    #             self.assertEqual(actual[0][key], expected[key])

    def test_get_group_by_id(self):
        expected = self.group.to_json()
        actual = group.get_group(self.group.get_id())
        self.assertEqual(actual, expected)

    def test_get_group_by_invalid_id(self):
        expected = None
        actual = group.get_group(ObjectId())
        self.assertEqual(actual, expected)

    def test_retrieve_empty_group_list(self):
        # Clear the database
        group.groupCollection.delete_many({})
        # Define test parameters
        actual = group.get_all_groups()
        expected = []
        # Assertion condition
        self.assertEqual(actual, expected)


class TestGroupAddition(unittest.TestCase):
    def tearDown(self):
        group.groupCollection.delete_many({})

    def test_add_group(self):
        groupObj = GroupDataManager.getGroup()
        actual = group.add_group(groupObj)
        self.assertTrue(actual)


class TestGroupUpdate(unittest.TestCase):
    def setUp(self):
        self.group = GroupDataManager.getGroup()
        group.add_group(self.group)

    def tearDown(self):
        group.groupCollection.delete_many({})

    # def test_update_group_by_id(self):
    #     # Make edits to group
    #     expectedGroup = copy.deepcopy(self.group)
    #     expectedGroup["notes"] = "Updated Notes"
    #     expectedGroup["assigned_project_id"] = "Updated Project"
    #     expectedGroup["members"] = "12345, 98765"

    #     # Ensure that the change is true
    #     actual = group.update_group_by_id(self.group.get_id(), expectedGroup)
    #     self.assertTrue(actual)

    #     # Validate keys
    #     actualGroup = group.get_group(self.group.get_id())
    #     self.assertDictEqual(actualGroup, expectedGroup)


class TestGroupModification(unittest.TestCase):
    def setUp(self):
        self.group = GroupDataManager.getGroup()
        group.add_group(self.group)
        self.student = GroupDataManager.getStudent()
        student.add_student(self.student)

    def tearDown(self):
        group.groupCollection.delete_many({})
        student.studentsCollection.delete_many({})

    def test_add_student_to_group(self):
        actual = group.add_student_to_group(self.group.get_id(), self.student.get_id())
        self.assertTrue(actual)

        # Validate member is added
        actualMembers = group.get_group(self.group.get_id())["members"]
        self.assertTrue(str(self.student.get_id()) in actualMembers)

    # 
    # This test is no longer valid since deprecation of student lookup/reference by email
    # 
    # @patch('app.models.student.get_student_by_email')
    # def test_remove_student_from_group_by_email(self, mock_get_student_by_email):
    #     # Mock the behavior of get_student_by_email
    #     mock_get_student_by_email.return_value = {"orgdefinedid": "12345", "email": "test@example.com"}
    #     # Add student to the group
    #     group.add_student_to_group("test@example.com", self.group.get_id())
    #     actual = group.remove_student_from_group_by_email(self.group["group_id"], "test@example.com")
    #     self.assertTrue(actual)

    #     # Validate member is removed
    #     actualMembers = group.get_group(self.group.get_id())["members"]
    #     self.assertFalse("12345" in actualMembers)

    # @patch('app.models.student.get_student_by_email')
    # def test_remove_student_from_group(self, mock_get_student_by_email):
    #     # Mock the behavior of get_student_by_email
    #     mock_get_student_by_email.return_value = {"orgdefinedid": "12345", "email": "test@example.com"}
    #     # Add student to the group
    #     group.add_student_to_group("test@example.com", self.group.get_id())
    #     # Remove student from the group
    #     actual = group.remove_student_from_group(self.group["group_id"], "12345")
    #     self.assertTrue(actual)

    #     # Validate member is removed
    #     actualMembers = group.get_group(self.group.get_id())["members"]
    #     self.assertFalse("12345" in actualMembers)


class TestGroupDeletion(unittest.TestCase):
    def setUp(self):
        self.group = GroupDataManager.getGroup()
        group.add_group(self.group)

    def tearDown(self):
        group.groupCollection.delete_many({})

    def test_delete_group_by_id(self):
        response = group.delete_group_by_id(self.group.get_id())
        self.assertTrue(response)

        actualState = group.get_group(self.group.get_id())
        self.assertIsNone(actualState)


class TestProjectAssignment(unittest.TestCase):
    def setUp(self):
        self.group = GroupDataManager.getGroup()
        group.add_group(self.group)

        self.project = GroupDataManager.getProject()
        project.add_project(self.project)


    def tearDown(self):
        group.groupCollection.delete_many({})
        project.projectCollection.delete_many({})

    def test_add_project_to_group(self):
        actual = group.add_project_to_group(self.group.get_id(), self.project.get_id())
        self.assertTrue(actual)

        # Validate project is assigned
        actualProject = group.get_group(self.group.get_id())["assigned_project_id"]
        self.assertEqual(self.project.get_id(), actualProject)

    def test_remove_project_from_group(self):
        group.add_project_to_group(self.group.get_id(), self.project.get_id())
        actual = group.remove_project_from_group(self.group.get_id())
        self.assertTrue(actual)

        # Validate project is removed
        actualProject = group.get_group(self.group.get_id())["assigned_project_id"]
        self.assertTrue(actualProject == '')
