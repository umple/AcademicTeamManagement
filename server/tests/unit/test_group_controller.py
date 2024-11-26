import unittest
from unittest.mock import MagicMock
from app.models import group
from flask import jsonify, request
from bson import ObjectId
from app.controllers.group_controller import get_groups 

class TestGroupController(unittest.TestCase):
    
    def test_get_groups(self):
        """ Test GET /groups """
        response = self.client.get('/groups')
        self.assertEqual(response.status_code, 200)
        
        # If group list is not empty, check that response contains 'groups' key
        response_data = json.loads(response.data)
        if response_data['count'] > 0:
            self.assertIn('groups', response_data)
        else:
            self.assertIn('message', response_data)

    def test_get_groups_success(self):
        # Create a mock group list
        mock_group_list = [{'name': 'Group A'}, {'name': 'Group B'}]
        
        # Mock the get_all_groups() method to return the mock group list
        group.get_all_groups = MagicMock(return_value=mock_group_list)
        
        # Make a GET request to the /groups endpoint
        response = self.client.get('/groups')
        
        # Assertions
        self.assertEqual(response.status_code, 200)  # Check for OK status
        response_json = response.get_json()
        self.assertEqual(response_json['count'], 2)  # Ensure the count is correct
        self.assertEqual(len(response_json['groups']), 2)  # Ensure the correct number of groups
        self.assertIn('groups', response_json)  # Ensure the 'groups' key is in the response
