class UserEntity:
    def __init__(self, user_id, role, user_data):
        self._user_id = user_id
        self._role = role
        self._email = user_data.get('email', '')
        
    def to_json(self):
        return {
            '_id': self._user_id,
            'email': self._email,
            'role': self._role
        }

    @property
    def user_id(self):
        return self._user_id
    
    @user_id.setter
    def user_id(self, user_id):
        self._user_id = user_id

    @property
    def email(self):
        return self._email
    
    @email.setter
    def email(self, email):
        self._email = email

    @property
    def role(self):
        return self._role
    
    @role.setter
    def role(self, role):
        self._role = role