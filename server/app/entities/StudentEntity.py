class StudentEntity:
    def __init__(self, student_id, student_data):
        if student_data is None:
            student_data = {}
        self._student_id = student_id
        self._orgdefinedid = student_data.get('orgdefinedid', '')
        self._firstname = student_data.get('firstname', '')
        self._lastname = student_data.get('lastname', '')
        self._email = student_data.get('email', '')
        self._username = student_data.get('username', '')
        self._sections = student_data.get('sections', '')
        self._finalGrade = student_data.get('finalGrade', '')
        self._group =  student_data.get('group', '')
        self._professorEmail = student_data.get('professorEmail', None)
        
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