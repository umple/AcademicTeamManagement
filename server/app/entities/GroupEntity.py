class GroupEntity:
    def __init__(self, id, group_data=None):
        if group_data is None:
            group_data = {}
        self._id = id
        self._group_number = group_data.get('group_number', '')
        self._group_name = group_data.get('name', '')
        self._interested_project_ids = group_data.get('interested_project_ids', '')
        self._assigned_project_id = group_data.get('assigned_project_id', '')
        self._members = group_data.get('members', '')
        self._related_sections = group_data.get('related_sections', '')
        self._notes = group_data.get('notes', '')
        self._studentLock = group_data.get('studentLock', False)
        self._professorLock = group_data.get('professorLock', False)
    
    def to_json(self):
        return {
            '_id': self._id,
            'group_number': self._group_number,
            'group_name': self._group_name,
            'interested_project_ids': self._interested_project_ids,
            'assigned_project_id': self._assigned_project_id,
            'members': self._members,
            'related_sections': self._related_sections,
            'notes': self._notes,
            'studentLock': self._studentLock,
            'professorLock': self._professorLock
        }

    def get_id(self):
        return self._id

    @property
    def interested_project_ids(self):
        return self._interested_project_ids

    @interested_project_ids.setter
    def interested_project_ids(self, value):
        self._interested_project_ids = value

    @property
    def assigned_project_id(self):
        return self._assigned_project_id

    @assigned_project_id.setter
    def assigned_project_id(self, value):
        self._assigned_project_id = value

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
