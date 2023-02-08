import json
import re


'''
    check and replace special caracters "Á©" and replace them
    the "é" to support accents in the first name and last name
    of students
'''
def handle_special_characters(students_list):
    students_list = json.loads(students_list)
    copyright_char_regex = r"©"
    new_list = []
    for json_obj in students_list:
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
    remove the hashtage symbole from the json values that start 
    with it 
'''
def remove_hashtage_starting_characters(students_list):
    students_list = json.loads(students_list)
    hashtage_char_regex = r"#"
    new_list = []
    for json_obj in students_list:
        new_obj = {}
        for key, value in json_obj.items():
            if isinstance(value, str) and re.search(hashtage_char_regex, value) and value.index(hashtage_char_regex)==0:
                value = value[1:]
            new_obj[key] = value
        new_list.append(new_obj)
    return json.dumps(new_list)
