import * as Yup from "yup";

// Define the Yup schema for validation
const projectSchema = Yup.object().shape({
    name: Yup.string().required("Project Title is required"),
    description: Yup.string().required("Description is required"),
    client: Yup.string().required("Client Full Name is required"),
    clientEmail: Yup.string()
      .required("Client Email is required")
      .email("Invalid email address"),
    status : Yup.string(),
    professorEmail : Yup.string(),
    currentGroup : Yup.string()
  });

export default projectSchema