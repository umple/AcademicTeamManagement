import unittest
from app.utils import data_conversion as dc

class TestHandleSpecialCharacters(unittest.TestCase):
    def test_replaces_special_characters(self):
        input_json = '[{"name": "Jóhn © Döe"}]'
        expected_output = '[{"name": "J\\u00f3hn\\u00e9 D\\u00f6e"}]'
        self.assertEqual(dc.handle_special_characters(input_json), expected_output)
    
    def test_does_not_modify_non_special_characters(self):
        input_json = '[{"name": "John Doe"}]'
        self.assertEqual(dc.handle_special_characters(input_json), input_json)

class TestRemoveHashtagStartingCharacters(unittest.TestCase):
    def test_removes_hashtag_from_start_of_string(self):
        input_json = '[{"program": "#SEG"}]'
        expected_output = '[{"program": "SEG"}]'
        self.assertEqual(dc.remove_hashtag_starting_characters(input_json), expected_output)
    
    def test_does_not_modify_string_without_hashtag_at_start(self):
        input_json = '[{"program": "SEG #CSI"}]'
        self.assertEqual(dc.remove_hashtag_starting_characters(input_json), input_json)

class TestCleanUpJsonData(unittest.TestCase):
    def test_handles_both_special_characters_and_hashtags(self):
        input_json = '[{"name": "Jóhn © Döe", "program": "#SEG"}]'
        expected_output = '[{"name": "J\\u00f3hn\\u00e9 D\\u00f6e", "program": "SEG"}]'
        self.assertEqual(dc.clean_up_json_data(input_json), expected_output)
    
    def test_does_not_modify_both_special_characters_and_hashtags(self):
        input_json = '[{"name": "John Doe", "program": "SEG #CSI"}]'
        self.assertEqual(dc.clean_up_json_data(input_json), input_json)
