import * as Yup from "yup";

// Define the Yup schema for validation
const professorProjectSchema = Yup.object().shape({
    project: Yup.string().required("Project Title is required"),
    description: Yup.string().required("Description is required"),
    clientName: Yup.string().required("Client Full Name is required"),
    clientEmail: Yup.string()
      .required("Client Email is required")
      .email("Invalid email address"),
    status : Yup.string(),
    professorEmail : Yup.string(),
    currentGroup : Yup.string(),
    notes: Yup.string()
  });

export default professorProjectSchema;