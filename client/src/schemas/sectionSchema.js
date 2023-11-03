import * as Yup from "yup";

const sectionSchema =  (sections,_id) => { 
  
  const sectionSchema = Yup.object().shape({
  name: Yup.string().required("Name is required").test("is-unique", "Name already exists", function (value) {
    const group = sections.find(
      (section) => section._name != _id && section.name === value
    );
    return typeof group === "undefined";
  }),
  term: Yup.string().required("Term is required"),
  year: Yup.string().required("Year is required"),
  notes: Yup.string().required("Notes is required"),
});
  return sectionSchema
}

export default sectionSchema;