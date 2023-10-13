import * as Yup from "yup";

const studentSchema = Yup.object().shape({
  orgdefinedid: Yup.string().required("Org Defined ID is required").matches(/^\d{6,9}$/, "Org Defined ID must be a 6-9-digit number"),
  username: Yup.string().required("Username is required"),
  lastname: Yup.string().required("Last Name is required"),
  firstname: Yup.string().required("First Name is required"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),
  sections: Yup.string(),
  group: Yup.string(),
  professorEmail: Yup.string(),
});

export default studentSchema;
