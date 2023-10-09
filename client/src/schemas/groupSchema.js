import * as Yup from "yup";

// Define the Yup schema for validation
const groupSchema = Yup.object().shape({
  group_id: Yup.string().required("Group ID is required").test(
    "is-unique",
    "Group ID already exists",
    function (value) {
      const groups = this.options.context.groups || []; // Access groups from the form context

      // Check if a group with the same group_id exists
      const group = groups.find(
        (group) => group.group_id.toLowerCase() === value.toLowerCase()
      );

      // Return true if the group_id is unique, or false if it already exists
      return typeof group === "undefined";
    }
  ),
  project: Yup.string().required("Project name is required"),
  members: Yup.array().min(1, "At least one member is required"),
  notes: Yup.string(),
});

export default groupSchema;
