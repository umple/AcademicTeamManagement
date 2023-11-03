from .__init__ import db
from bson import ObjectId

sectionsCollection = db["sections"]

def get_all_sections():
    section_list = []
    for document in sectionsCollection.find():
        document["_id"] = str(document["_id"])
        section_list.append(document)
    return section_list

def add_section(section_obj):
    try:
        result = sectionsCollection.insert_one(section_obj.to_json())
        return result
    except Exception as e:
        print(f"Error adding section: {e}")
        return None

def get_section_by_id(a):
    document = sectionsCollection.find_one({"_id": ObjectId(a)})
    return document

def get_section_by_name(name):
    document = sectionsCollection.find_one({"name": name})
    document["name"] = str(document["name"])
    return document

def update_section_by_id(id, section_obj):
    result = sectionsCollection.update_one({"_id": ObjectId(id)}, {
        "$set":section_obj.to_json()
    })
    return result

def delete_section_by_id(a):
    try:
        section_to_delete = get_section_by_id(a)
        if section_to_delete is not None:
            # Delete the section document
            result = sectionsCollection.delete_one({"_id": ObjectId(a)})

            if result.deleted_count > 0:
                return "Successfully deleted section"
            else:
                return "No sections where deleted"
        else:
            return "Section not found"

    except Exception as e:
        raise e
