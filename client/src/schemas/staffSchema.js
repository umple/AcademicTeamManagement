import * as Yup from "yup";

const staffSchema =  (staffs,_id) => { 
  
  
  
const staffSchema = Yup.object().shape({
  email: Yup.string().required("Email is required").email("Invalid email address").test("is-unique", "Email already exists", function (value) {
    if (staffs && staffs.length > 0) {
      const staff = staffs.find(
        (staff) => staff._id != _id && staff.email === value 
    );
      return typeof staff === "undefined";
    } else {
      return true
    }
    }),
  username: Yup.string().required("Username is required"),
  lastname: Yup.string().required("Last Name is required"),
  firstname: Yup.string().required("First Name is required"),
  role: Yup.string().required("Role is required"),
});
  return staffSchema
}

export default staffSchema;
