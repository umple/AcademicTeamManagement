class GroupEntity:
    def __init__(self, group_data=None):
        if group_data is None:
            group_data = {}
        self._group_id = group_data.get('group_id', '')
        self._interested_project_ids = group_data.get('interested_project_ids', '')
        self._assigned_project_ids = group_data.get('_assigned_project_ids', '')
        self._sections = group_data.get('sections', '')
        self._notes = group_data.get('notes', '')
        self._studentLock = group_data.get('studentLock', False)
        self._professorLock = group_data.get('professorLock', False)
    
    def to_json(self):
        return {
            'group_id': self._group_id,
            'interested_project_ids': self._project,
            'professorEmail': self._professorEmail,
            'members': self._members,
            'interest': self._interest,
            'sections': self._sections,
            'notes': self._notes,
            'studentLock': self._studentLock,
            'professorLock': self._professorLock
        }

    @property
    def group_id(self):
        return self._group_id

    @group_id.setter
    def group_id(self, value):
        self._group_id = value

    @property
    def interested_project_ids(self):
        return self._project

    @interested_project_ids.setter
    def interested_project_ids(self, value):
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
    def interest(self):
        return self._interest

    @interest.setter
    def interest(self, value):
        self._interest = value

    @property
    def notes(self):
        return self._notes

    @notes.setter
    def notes(self, value):
        self._notes = value
