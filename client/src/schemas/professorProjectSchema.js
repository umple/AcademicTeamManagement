import * as Yup from 'yup'

// Define the Yup schema for validation
const professorProjectSchema = (projects, _id) => {
  const schema = Yup.object().shape({
    project_name: Yup.string().required('Project Title is required').test('is-unique', 'Project Title already exists', function (value) {
      if (projects && projects.length > 0) {
        const project = projects.find(
          (project) => project._id !== _id && project.project === value
        )
        return typeof project === 'undefined'
      } else {
        return true
      }
    }),
    description: Yup.string().required('Description is required'),
    // clientName: Yup.string().required("Client Full Name is required"),
    clientEmail: Yup.string()
      // .required("Client Email is required")
      .email('Invalid email address'),
    status: Yup.string(),
    professorEmail: Yup.string(),
    group: Yup.string(),
    notes: Yup.string()
  })
  return schema
}

export default professorProjectSchema
