class GroupEntity:
    def __init__(self, group_data=None):
        if group_data is None:
            group_data = {}
        self._group_id = group_data.get('group_id', '')
        self._project = group_data.get('project', '')
        self._professorEmail = group_data.get('professorEmail', '')
        self._members = group_data.get('members', [])
        self._notes = group_data.get('notes', '')
    
    def to_json(self):
        return {
            'group_id': self._group_id,
            'project': self._project,
            'professorEmail': self._professorEmail,
            'members': self._members,
            'notes': self._notes,
        }

    @property
    def group_id(self):
        return self._group_id

    @group_id.setter
    def group_id(self, value):
        self._group_id = value

    @property
    def project(self):
        return self._project

    @project.setter
    def project(self, value):
        self._project = value
        
    @property
    def professorEmail(self):
        return self._professorEmail

    @professorEmail.setter
    def professorEmail(self, value):
        self._professorEmail = value

    @property
    def members(self):
        return self._members

    @members.setter
    def members(self, value):
        self._members = value

    @property
    def notes(self):
        return self._notes

    @notes.setter
    def notes(self, value):
        self._notes = value
