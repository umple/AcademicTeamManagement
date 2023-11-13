import * as Yup from "yup";

// Define the Yup schema for validation
const projectSchema = (projects,_id) => {
  const schema = Yup.object().shape({
    project: Yup.string().required("Project Title is required").test("is-unique", "Project Title already exists", function (value) {
      if (projects && projects.length > 0) {
        const project = projects.find(
          (project) => project._id != _id && project.project === value 
        );
        return typeof project === "undefined";
      } else {
        return true
      }
    }),
    description: Yup.string().required("Description is required"),
    //clientName: Yup.string().required("Client Full Name is required"),
    clientEmail: Yup.string()
      //.required("Client Email is required")
      .email("Invalid email address"),
    status : Yup.string().required("Status is required"),
    professorEmail : Yup.string(),
    group : Yup.string()
  });
  return schema
}

export default projectSchema