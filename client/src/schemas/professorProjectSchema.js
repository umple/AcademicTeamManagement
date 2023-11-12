import * as Yup from "yup";

// Define the Yup schema for validation
const professorProjectSchema = Yup.object().shape({
    project: Yup.string().required("Project Title is required"),
    description: Yup.string().required("Description is required"),
    clientName: Yup.string(),
    clientEmail: Yup.string()
      .email("Invalid email address"),
    status : Yup.string(),
    professorEmail : Yup.string(),
    currentGroup : Yup.string(),
    notes: Yup.string()
  });

export default professorProjectSchema;