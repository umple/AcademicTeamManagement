import json
import re


'''
    check and replace special caracters "Á©" and replace them
    the "é" to support accents in the first name and last name
    of students
'''
def handle_special_characters(json_data):
    json_data = json.loads(json_data)
    copyright_char_regex = r"©"
    new_list = []
    for json_obj in json_data:
        new_obj = {}
        for key, value in json_obj.items():
            if isinstance(value, str) and re.search(copyright_char_regex, value):
                value = re.sub(copyright_char_regex, "é", value)
                Index = value.index('é') - 1
                value = value[:Index] + value[Index + 1:]
            new_obj[key] = value
        new_list.append(new_obj)
    return json.dumps(new_list)

'''
    remove the hashtag symbole from the json values that start 
    with it 
'''
def remove_hashtag_starting_characters(json_data):
    json_data = json.loads(json_data)
    hashtage_char_regex = r"#"
    new_list = []
    for json_obj in json_data:
        new_obj = {}
        for key, value in json_obj.items():
            if isinstance(value, str) and re.search(hashtage_char_regex, value) and value.index(hashtage_char_regex)==0:
                value = value[1:]
            new_obj[key] = value
        new_list.append(new_obj)
    return json.dumps(new_list)

'''
    clean up json data from the "#" and "Á©" symboles
'''
def clean_up_json_data(json_data):
    json_data = handle_special_characters(json_data)
    json_data = remove_hashtag_starting_characters(json_data)
    return json_data