import * as Yup from 'yup'

// Define the Yup schema for validation
const createGroupSchema = (groups, _id) => {
  const groupSchema = Yup.object().shape({
    group_id: Yup.string()
      .required('Group ID is required')
      .transform((value) => value.trim())
      .test('is-unique', 'Group ID already exists', function (value) {
        if (groups && groups.length > 0) {
          const group = groups.find(
            (group) => group._id !== _id && group.group_id.toLowerCase() === value.toLowerCase()
          )
          return typeof group === 'undefined'
        } else {
          return true
        }
      }),
    // project: Yup.string().required("Project name is required"),
    // members: Yup.array().min(1, "At least one member is required"),
    sections: Yup.string().required('You should at least choose a section for this group'),
    notes: Yup.string()
  })
  return groupSchema
}
export default createGroupSchema
