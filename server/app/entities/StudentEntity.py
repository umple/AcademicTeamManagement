from app.entities.UserEntity import UserEntity
class StudentEntity(UserEntity):
    def __init__(self, student_data):
        super().__init__(
            id, 
            student_data.get('role'),
            student_data.get('email'),
            student_data.get('firstname'),
            student_data.get('lastname'),
            student_data.get('is_admin'),
            student_data.get('section_ids'))

        self._student_number = student_data.get('student_number')
        self._final_grade = student_data.get('final_grade')
        self._group_id = student_data.get('group_id')
        
    def to_json(self):
        return {
            '_id': self._id,
            'student_number': self._student_number,
            'final_grade': self._final_grade,
            'group_id': self._group_id,
        }
        
    @property
    def student_number(self):
        return self._student_number
    
    @student_number.setter
    def student_number(self, student_number):
        self._student_number = student_number
        
    @property
    def final_grade(self):
        return self._finalGrade

    @final_grade.setter
    def final_grade(self, final_grade):
        self._finalGrade = final_grade

    @property
    def group_id(self):
        return self._group_id

    @group_id.setter
    def group_id(self, group_id):
        self._group_id = group_id