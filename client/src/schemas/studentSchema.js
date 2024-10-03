import * as Yup from 'yup'

const studentSchema = (students, _id) => {
  const studentSchema = Yup.object().shape({
    student_number: Yup.string().required('Org Defined ID is required').matches(/^\d{6,9}$/, 'Org Defined ID must be a 6-9-digit number').test('is-unique', 'Student ID already exists', function (value) {
      if (students && students.length > 0) {
        const group = students.find(
          (student) => student._id !== _id && student.student_number === value
        )
        return typeof group === 'undefined'
      } else {
        return true
      }
    }),
    username: Yup.string().required('Username is required'),
    lastname: Yup.string().required('Last Name is required'),
    firstname: Yup.string().required('First Name is required'),
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email address')
      .test('is-unique', 'Email already exists', function (value) {
        if (students && students.length > 0) {
          const group = students.find(
            (student) => student._id !== _id && student.email === value
          )
          return typeof group === 'undefined'
        } else {
          return true
        }
      }),
    sections: Yup.string().required('Section is required'),
    group: Yup.string(),
    professorEmail: Yup.string()
  })
  return studentSchema
}

export default studentSchema
