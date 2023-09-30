class ProjectEntity:
    def __init__(self, project_data=None):
        if project_data is None:
            project_data = {}
        self._project = project_data.get('project', '')
        self._description = project_data.get('description', '')
        self._clientName = project_data.get('clientName', '')
        self._clientEmail = project_data.get('clientEmail', '')
        self._status = project_data.get('status', 'new')
        self._interested_groups = project_data.get('interested_groups', [])
        self._group = project_data.get('group', '')
        self._professorEmail = project_data.get('professorEmail', '')
        self._visibility = project_data.get('visibility', '')
        self._notes = project_data.get('notes', '')

    @property
    def project(self):
        return self._project

    @project.setter
    def project(self, value):
        self._project = value

    @property
    def description(self):
        return self._description

    @description.setter
    def description(self, value):
        self._description = value

    @property
    def clientName(self):
        return self._clientName

    @clientName.setter
    def clientName(self, value):
        self._clientName = value

    @property
    def clientEmail(self):
        return self._clientEmail

    @clientEmail.setter
    def clientEmail(self, value):
        self._clientEmail = value

    @property
    def status(self):
        return self._status

    @status.setter
    def status(self, value):
        self._status = value

    @property
    def interested_groups(self):
        return self._interested_groups

    @interested_groups.setter
    def interested_groups(self, value):
        self._interested_groups = value

    @property
    def group(self):
        return self._group

    @group.setter
    def group(self, value):
        self._group = value

    @property
    def professorEmail(self):
        return self._professorEmail

    @professorEmail.setter
    def professorEmail(self, value):
        self._professorEmail = value

    @property
    def visibility(self):
        return self._visibility

    @visibility.setter
    def visibility(self, value):
        self._visibility = value

    @property
    def notes(self):
        return self._notes

    @notes.setter
    def notes(self, value):
        self._notes = value
