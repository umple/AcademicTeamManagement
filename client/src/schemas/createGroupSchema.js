import * as Yup from "yup";

// Define the Yup schema for validation
const createGroupSchema = (groups,_id) => {
  const groupSchema = Yup.object().shape({
    group_id: Yup.string()
      .required("Group ID is required")
      .test("is-unique", "Group ID already exists", function (value) {
        const group = groups.find(
          (group) => group._id != _id && group.group_id.toLowerCase() === value.toLowerCase() 
        );
        return typeof group === "undefined";
      }),
    //project: Yup.string().required("Project name is required"),
    //members: Yup.array().min(1, "At least one member is required"),
    notes: Yup.string(),
  });
  return groupSchema;
};
export default createGroupSchema;
