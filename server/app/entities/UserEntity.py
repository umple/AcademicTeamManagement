class UserEntity:
    def __init__(self, id, role, email, firstname, lastname, is_admin, section_ids=[]):
        self._id = id
        self._role = role
        self._email = email
        self._firstname = firstname
        self._lastname = lastname
        self._is_admin = is_admin

        if section_ids == None:
            self._section_ids = []

        else:
            self._section_ids = section_ids
        
    def to_json(self):
        return {
            '_id': self._id,
            'email': self._email,
            'firstname': self._firstname,
            'lastname': self._lastname,
            'is_admin': self._is_admin
        }

    @property
    def id(self):
        return self._id
    
    @id.setter
    def id(self, id):
        self._id = id

    @property
    def email(self):
        return self._email
    
    @email.setter
    def email(self, email):
        self._email = email

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
    def lastname(self, lastname):
        self._lastname = lastname

    @property
    def is_admin(self):
        return self._is_admin

    @is_admin.setter
    def is_admin(self, is_admin):
        self._is_admin = lastname

    @property
    def section_ids(self):
        return self._section_ids

    @section_ids.setter
    def section_ids(self):
        self._section_ids = section_ids