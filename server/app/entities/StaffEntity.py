class StaffEntity:
    def __init__(self, staff_id, staff_data):
        if staff_data is None:
            staff_data = {}
                
        self._staff_id = staff_id
        self._firstname = staff_data.get('firstname', '')
        self._lastname = staff_data.get('lastname', '')
        self._email = staff_data.get('email', '')
        self._username = staff_data.get('username', '')
        self._role = staff_data.get('role', '')
        
    def to_json(self):
        return {
            '_id': self._staff_id,
            'firstname': self._firstname,
            'lastname': self._lastname,
            'email': self._email,
            'username': self._username,
            'role': self._role,
        }

    @property
    def staff_id(self):
        return self._staff_id
    
    @staff_id.setter
    def staff_id(self, staff_id):
        self._staff_id = staff_id

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
    def role(self):
        return self._role

    @role.setter
    def role(self, role):
        self._role = role
