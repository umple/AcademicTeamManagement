import * as Yup from 'yup'

// Define the Yup schema for validation
const createGroupSchema = (groups, _id) => {
  const groupSchema = Yup.object().shape({
    // project: Yup.string().required("Project name is required"),
    // members: Yup.array().min(1, "At least one member is required"),
    // related_sections: Yup.string().required('Section is required'),
    notes: Yup.string()
  })
  return groupSchema
}
export default createGroupSchema
