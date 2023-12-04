class SectionEntity:
    def __init__(self, Section_data):
        if Section_data is None:
            Section_data = {}
        self._name = Section_data.get('name', '')
        self._term = Section_data.get('term', '')
        self._year = Section_data.get('year', '')
        self._notes = Section_data.get('notes', '')
        self._lock = Section_data.get('lock', False)
        
    def to_json(self):
        return {
            'name': self._name,
            'term': self._term,
            'year': self._year,
            'notes': self._notes,
            'lock': self._lock
        }

    @property
    def name(self):
        return self._name
    
    @name.setter
    def name(self, name):
        self._name = name

    @property
    def term(self):
        return self._term

    @term.setter
    def term(self, term):
        self._term = term

    @property
    def year(self):
        return self._year

    @year.setter
    def set_year(self, year):
        self._year = year

    @property
    def notes(self):
        return self._notes
    
    @notes.setter
    def notes(self, notes):
        self._notes = notes
        
    @property
    def lock(self):
        return self._lock
    
    @lock.setter
    def lock(self, lock):
        self._lock = lock
