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
                Index = value.index('é') - 1 # store the index of the Á char
                value = value[:Index] + value[Index + 1:] # remove the Á char
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
                value = value[1:] # copy the string from index 1 to ignore the first char which is the #
            new_obj[key] = value
        new_list.append(new_obj)
    return json.dumps(new_list)

def fix_keys(json_data):
    json_data = json.loads(json_data)
    for json_obj in json_data:
        if "end-of-line indicator" in json_obj:
            json_obj.pop("end-of-line indicator")
        if "first name" in json_obj:
            json_obj["firstname"] = json_obj.pop("first name")
        if "last name" in json_obj:
            json_obj["lastname"] = json_obj.pop("last name")
    
    return json.dumps(json_data)
    

'''
    clean up json data from the "#" and "Á©" symboles
'''
def clean_up_json_data(json_data):
    json_data = handle_special_characters(json_data)
    json_data = remove_hashtag_starting_characters(json_data)
    json_data = fix_keys(json_data)
    return json_data