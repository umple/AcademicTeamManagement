import * as Yup from 'yup'

const sectionSchema = (sections, _id) => {
  const sectionSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').test('is-unique', 'Name already exists', function (value) {
      if (sections && sections.length > 0) {
        const section = sections.find(
          (section) => section._id != _id && section.name === value
        )
        return typeof section === 'undefined'
      } else {
        return true
      }
    }),
    term: Yup.string().required('Term is required'),
    year: Yup.string().required('Year is required')
  })
  return sectionSchema
}

export default sectionSchema
