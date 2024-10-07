from app.models import section
from app.models import group
from app.models import staff
class StudentEntity:
    def __init__(self, student_id, student_data):
        # Ensure the student_data is a dictionary; otherwise, use an empty dictionary
        if student_data is None:
            student_data = {}

        # If the student_data is in the original format (dict with specific keys)
        if type(student_data) == dict:
            # Set basic student attributes using both capitalized and lowercase key formats
            self._student_id = student_id
            self._orgdefinedid = student_data.get('Student ID', student_data.get('orgdefinedid', ''))
            self._firstname = student_data.get('First Name', student_data.get('firstname', ''))
            self._lastname = student_data.get('Last Name', student_data.get('lastname', ''))
            self._email = student_data.get('Email', student_data.get('email', ''))
            self._username = student_data.get('Username', student_data.get('username', ''))

            # Check if the section is valid; if not, use an empty string
            section_name = student_data.get('Section', student_data.get('sections', ''))
            self._sections = "" if section.get_section_by_name(section_name) is None else section_name

            # Set final grade
            self._finalGrade = student_data.get('Final Grade', student_data.get('finalGrade', ''))

            # Check if the group is valid; if not, use an empty string
            group_name = student_data.get('Group', student_data.get('group', ''))
            self._group = "" if group.get_group_by_group_name(group_name) is None else group_name

            # Check if professor email is valid; if not, use an empty string
            professor_email = student_data.get('professorEmail', '')
            self._professorEmail = "" if staff.get_staff_by_email(professor_email) is None else professor_email

        # If student_data is not a regular dictionary, handle differently (use get with defaults)
        else:
            self._student_id = student_id
            self._orgdefinedid = student_data.get('orgdefinedid', '')
            self._firstname = student_data.get('firstname', '')
            self._lastname = student_data.get('lastname', '')
            self._email = student_data.get('email', '')
            self._username = student_data.get('username', '')
            self._sections = student_data.get('sections', '')
            self._finalGrade = student_data.get('finalGrade', '')
            self._group = student_data.get('group', '')
            self._professorEmail = student_data.get('professorEmail', '')

    def to_json(self):
        return {
            '_id': self._student_id,
            'orgdefinedid': self._orgdefinedid,
            'firstname': self._firstname,
            'lastname': self._lastname,
            'email': self._email,
            'username': self._username,
            'sections': self._sections,
            'finalGrade': self._finalGrade,
            'group': self._group,
            'professorEmail': self._professorEmail
        }

    @property
    def student_id(self):
        return self._student_id
    
    @student_id.setter
    def student_id(self, student_id):
        self._student_id = student_id
        
    @property
    def orgdefinedid(self):
        return self._orgdefinedid
    
    @orgdefinedid.setter
    def orgdefinedid(self, orgdefinedid):
        self._orgdefinedid = orgdefinedid

    @property
    def firstname(self):
        return self._firstname

    @firstname.setter
    def firstname(self, firstname):
        self._firstname = firstname

    @property
    def lastname(self):
        return self._lastname

    @lastname.setter
    def set_lastname(self, lastname):
        self._lastname = lastname

    @property
    def email(self):
        return self._email
    
    @email.setter
    def email(self, email):
        self._email = email

    @property
    def username(self):
        return self._username

    @username.setter
    def username(self, username):
        self._username = username
        
    @property
    def sections(self):
        return self._sections

    @sections.setter
    def sections(self, sections):
        self._sections = sections
        
    @property
    def finalGrade(self):
        return self._finalGrade

    @finalGrade.setter
    def finalGrade(self, finalGrade):
        self._finalGrade = finalGrade

    @property
    def group(self):
        return self._group

    @group.setter
    def group(self, group):
        self._group = group

    @property
    def professor_email(self):
        return self._professorEmail

    @professor_email.setter
    def professor_email(self, professor_email):
        self._professorEmail = professor_email