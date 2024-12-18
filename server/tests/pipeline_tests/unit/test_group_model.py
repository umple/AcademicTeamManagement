import unittest
from unittest.mock import patch
import app.models.group as group
from app.entities.GroupEntity import GroupEntity
from bson import ObjectId
import copy

class GroupDataManager:
    def getGroup():
        group_json_sample = {
            "_id": ObjectId(),
            "group_id": "Test Group",
            "group_number": "1",
            "project": None,
            "professorEmail": "prof@test.com",
            "members": [],
            "notes": "Test Notes"
        }
        return group_json_sample

class TestGroupRetrieval(unittest.TestCase):
    def setUp(self):
        # Add group to mock
        self.group = GroupDataManager.getGroup()
        group.groupCollection.insert_one(self.group)

    def tearDown(self):
        group.groupCollection.delete_many({})

    def test_retrieve_with_groups(self):
        expected = self.group
        actual = group.get_all_groups()
        for key in list(expected):
            if key != "_id":
                self.assertEqual(actual[0][key], expected[key])

    def test_get_group_by_id(self):
        expected = self.group
        actual = group.get_group(expected["_id"])
        for key in list(expected):
            if key != "_id":
                self.assertEqual(actual[key], expected[key])

    def test_get_group_by_invalid_id(self):
        expected = None
        actual = group.get_group(ObjectId())
        self.assertEqual(actual, expected)

    def test_get_group_by_group_name(self):
        expected = self.group
        actual = group.get_group_by_group_name(expected["group_id"])
        self.assertEqual(actual["group_id"], expected["group_id"])

    def test_get_group_by_invalid_name(self):
        expected = None
        actual = group.get_group_by_group_name("Nonexistent Group")
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

    # def test_add_group(self):
    #     groupObj = GroupEntity(GroupDataManager.getGroup())
    #     actual = group.add_group(groupObj)
    #     self.assertTrue(actual)


class TestGroupUpdate(unittest.TestCase):
    def setUp(self):
        self.group = GroupDataManager.getGroup()
        group.groupCollection.insert_one(self.group)

    def tearDown(self):
        group.groupCollection.delete_many({})

    # def test_update_group_by_id(self):
    #     # Make edits to group
    #     expectedGroup = copy.deepcopy(self.group)
    #     expectedGroup["notes"] = "Updated Notes"
    #     expectedGroup["project"] = "Updated Project"
    #     expectedGroup["members"] = "12345, 98765"

    #     # Ensure that the change is true
    #     actual = group.update_group_by_id(self.group["_id"], expectedGroup)
    #     self.assertTrue(actual)

    #     # Validate keys
    #     actualGroup = group.get_group(self.group["_id"])
    #     self.assertDictEqual(actualGroup, expectedGroup)


class TestGroupModification(unittest.TestCase):
    def setUp(self):
        self.group = GroupDataManager.getGroup()
        group.groupCollection.insert_one(self.group)

    def tearDown(self):
        group.groupCollection.delete_many({})

    @patch('app.models.student.get_student_by_email')
    @patch('app.models.student.assign_group_to_student')
    def test_add_student_to_group(self, mock_assign_group_to_student, mock_get_student_by_email):
        # Mock the behavior of get_student_by_email and assign_group_to_student
        mock_get_student_by_email.return_value = {"orgdefinedid": "12345", "email": "test@example.com"}
        mock_assign_group_to_student.return_value = True

        actual = group.add_student_to_group("test@example.com", self.group["_id"])
        self.assertTrue(actual)

        # Validate member is added
        actualMembers = group.get_group(self.group["_id"])["members"]
        self.assertTrue("12345" in actualMembers)

    @patch('app.models.student.get_student_by_email')
    def test_remove_student_from_group(self, mock_get_student_by_email):
        # Mock the behavior of get_student_by_email
        mock_get_student_by_email.return_value = {"orgdefinedid": "12345", "email": "test@example.com"}

        # Add student to the group
        group.add_student_to_group("test@example.com", self.group["_id"])

        # **Print group members after addition**
        members_before = group.get_group(self.group["_id"])["members"]
        print(f"Members before removal: {members_before}")
        self.assertIn("12345", members_before)  # Ensure the student was added

        # Remove student from the group
        actual = group.remove_student_from_group(self.group["group_id"], "12345")
        self.assertTrue(actual)

        # **Print group members after removal**
        actualMembers = group.get_group(self.group["_id"])["members"]
        print(f"Members after removal: {actualMembers}")
        self.assertFalse("12345" in actualMembers)


class TestGroupDeletion(unittest.TestCase):
    def setUp(self):
        self.group = GroupDataManager.getGroup()
        group.groupCollection.insert_one(self.group)

    def tearDown(self):
        group.groupCollection.delete_many({})

    def test_delete_group_by_id(self):
        response = group.delete_group_by_id(self.group["_id"])
        self.assertTrue(response)

        actualState = group.get_group(self.group["_id"])
        self.assertIsNone(actualState)


class TestProjectAssignment(unittest.TestCase):
    def setUp(self):
        self.group = GroupDataManager.getGroup()
        group.groupCollection.insert_one(self.group)

    def tearDown(self):
        group.groupCollection.delete_many({})

    def test_add_project_to_group(self):
        actual = group.add_project_to_group(self.group["group_id"], "Test Project")
        self.assertTrue(actual)

        # Validate project is assigned
        actualProject = group.get_group(self.group["_id"])["project"]
        self.assertEqual("Test Project", actualProject)

    def test_remove_project_from_group(self):
        group.add_project_to_group(self.group["group_id"], "Test Project")
        actual = group.remove_project_from_group("Test Project")
        self.assertTrue(actual)

        # Validate project is removed
        actualProject = group.get_group(self.group["_id"])["project"]
        self.assertTrue(actualProject == '')
