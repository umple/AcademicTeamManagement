from app.entities.UserEntity import UserEntity
class StaffEntity(UserEntity):
    def __init__(self, id, staff_data):
        super().__init__(
            id, 
            staff_data.get('role'),
            staff_data.get('email'),
            staff_data.get('firstname'),
            staff_data.get('lastname'),
            staff_data.get('is_admin'),
            staff_data.get('section_ids'))

        self._role = staff_data.get('role')
        
    def to_json(self):
        return {
            '_id': self._id,
            'role': self._role,
            'email': self._email,
            'firstname': self._firstname,
            'lastname': self._lastname,
            'is_admin': self._is_admin,
        }

    @property
    def role(self):
        return self._role

    @role.setter
    def role(self, role):
        self._role = role
