import unittest
from app.models import project
from app.entities.ProjectEntity import ProjectEntity
from bson import ObjectId
import copy

class ProjectDataManager:
    def getProject():

        project_json_sample = {    
            "_id": ObjectId(),
            "project": "Sample Project",
            "description": "This is a sample project.",
            "status": "new",
            "group": None,
            "interested groups": []
        }

        return project_json_sample

class TestProjectRetrieval(unittest.TestCase):
    def setUp(self):
        # Add project to mock
        self.project = ProjectDataManager.getProject()
        project.projectCollection.insert_one(self.project)

    def tearDown(self):
        project.projectCollection.delete_many({})

    def test_retrieve_with_projects(self):
        expected = self.project
        actual = project.get_all_projects()
        for key in list(expected):
            if key != "_id":
                self.assertEqual(actual[0][key], expected[key])

    def test_get_project_by_id(self):
        expected = self.project
        actual = project.get_project(expected["_id"])
        for key in list(expected):
            if key != "_id":
                self.assertEqual(actual[key], expected[key])

    def test_get_project_by_invalid_id(self):
        expected = None
        actual = project.get_project(ObjectId())
        self.assertEqual(actual, expected)

    def test_get_project_by_name(self):
        expected = self.project
        actual = project.get_project_by_name(expected["project"])
        self.assertDictEqual(actual, expected)

    def test_get_project_by_invalid_name(self):
        expected = None
        actual = project.get_project_by_name("Mock Project")
        self.assertEqual(actual, expected)

    def test_get_interested_groups(self):
        expected = self.project
        actual = project.get_interested_groups()
        self.assertEqual(len(actual[str(expected["_id"])]), len(expected["interested groups"]))

    def test_retrieve_empty_project_list(self):
        # Clear the database
        project.projectCollection.delete_many({})
        # Define test parameters
        actual = project.get_all_projects()
        expected = []
        # Assertion condition
        self.assertEqual(actual, expected)

    def test_get_project_not_applied_to(self):
        # Add another project to the projects collection
        self.project2 = ProjectDataManager.getProject()
        self.project2["status"] = "assigned"
        project.projectCollection.insert_one(self.project2)

        # Call the function and get the list of projects not applied to
        actual = project.get_project_not_applied_to()

        # Verify that only the project with "new" status is returned
        self.assertEqual(len(actual), 1)
        self.assertEqual(actual[0]["status"], "new")


class TestProjectAddition(unittest.TestCase):
    def tearDown(self):
        project.projectCollection.delete_many({})

    def test_add_project(self):
        projectObj = ProjectEntity(ProjectDataManager.getProject())
        actual = project.add_project(projectObj)
        self.assertTrue(actual)

    def test_add_project_when_status_null(self):
        projectObj = ProjectEntity(ProjectDataManager.getProject())
        projectObj.status = None
        actual = project.add_project(projectObj)
        self.assertTrue(actual)

    def test_add_project_exception(self):
        project_obj = ProjectEntity(ProjectDataManager.getProject())
        with unittest.mock.patch('app.models.project.insert_one') as mock_insert:
            mock_insert.side_effect = Exception("Test Exception")

            result = project.add_project(project_obj)
            self.assertIsNone(result)

            self.assertTrue(mock_insert.called)
            self.assertTrue("Error adding project:" in mock_insert.call_args_list[0][0][0])


class TestProjectUpdate(unittest.TestCase):
    def setUp(self):
        self.project = ProjectDataManager.getProject()
        project.projectCollection.insert_one(self.project)

    def tearDown(self):
        project.projectCollection.delete_many({})

    def test_update_project_by_id(self):
        # Make edits to project
        expectedProject = copy.deepcopy(self.project)
        expectedProject["description"] = "Updated description"
        expectedProject["status"] = "assigned"

        # Ensure that the change is true
        actual = project.update_project_by_id(self.project["_id"], expectedProject)
 

        self.assertTrue(actual)

        # Validate keys
        actualProject = project.get_project(self.project["_id"])
        ex = project.get_project_by_name(expectedProject["project"])
        
        self.assertDictEqual(actualProject,ex)


class TestProjectModification(unittest.TestCase):
    def setUp(self):
        self.project = ProjectDataManager.getProject()
        project.projectCollection.insert_one(self.project)

    def tearDown(self):
        project.projectCollection.delete_many({})

    def test_add_group_to_project(self):
        actual = project.add_group_to_project(self.project["project"], "Test Group")
        self.assertTrue(actual)

        # Validate group name is correct
        actualGroup = project.get_project(self.project["_id"])["group"]
        self.assertEqual("Test Group", actualGroup)

    def test_add_group_to_project_returns_false_when_project_assigned(self):
        self.project["status"] = "assigned"
        actual = project.add_group_to_project(self.project["project"], "Test Group")
        self.assertFalse(actual)

    def test_add_interested_group_to_project(self):
        actual = project.add_interested_group_to_project(self.project["project"], "Interest Group")
        self.assertTrue(actual)

        # Validate group is added to interested groups
        actualInterestedGroups = project.get_project(self.project["_id"])["interested groups"]
        self.assertTrue("Interest Group" in actualInterestedGroups)

    def test_change_status(self):
        actual = project.change_status(self.project["project"], "assigned")
        self.assertTrue(actual)

        # Validate status is updated
        actualStatus = project.get_project(self.project["_id"])["status"]
        self.assertEqual("assigned", actualStatus)


class TestProjectDeletion(unittest.TestCase):
    def setUp(self):
        self.project = ProjectDataManager.getProject()
        project.projectCollection.insert_one(self.project)

    def tearDown(self):
        project.projectCollection.delete_many({})

    def test_delete_project_by_id(self):
        response = project.delete_project_by_id(self.project["_id"])
        self.assertTrue(response)

        actualState = project.get_project(self.project["_id"])
        self.assertIsNone(actualState)