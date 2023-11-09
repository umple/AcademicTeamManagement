import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  TextField,
  DialogActions,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import studentService from "../../../services/studentService";
import Student from "../../../entities/Student";
import studentSchema from "../../../schemas/studentSchema";
import sectionService from "../../../services/sectionService";

const StudentForm = ({
  open,
  columns,
  setCreateModalOpen,
  fetchStudents,
  editingRow,
  students,
}) => {

  // retrieve the sections
  const [sections, setSections] = useState([]);
  const fetchSections = async () => {
    try {
      let sections = await sectionService.get();
      sections.sections && setSections(sections.sections);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const onSubmit = async (values, actions) => {
    try {
      let response;
      response = await studentService.add(values);
      fetchStudents();
    } catch (error) {
      console.log(error);
    }
    actions.resetForm();
    handleClose();
  };

  const handleClose = () => {
    setCreateModalOpen(false);
  };

  const [initialStudentValues] = useState(
    new Student({
        professorEmail: JSON.parse(localStorage.getItem("userEmail")),
    })
  );

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
  } = useFormik({
    initialValues: initialStudentValues.toRequestJSON(),
    validationSchema: studentSchema(students),
    onSubmit,
  });
  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Student</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            {columns.map((column) => {
              if (column.accessorKey === "sections") {
                return (
                  <FormControl fullWidth>
                    <InputLabel id="section-label">Section</InputLabel>
                    <Select
                      fullWidth
                      labelId="section-label"
                      defaultValue=""
                      variant="outlined"
                      label="Section"
                      key={column.accessorKey}
                      name={column.accessorKey}
                      value={values[column.accessorKey]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(
                        touched[column.accessorKey] &&
                          errors[column.accessorKey]
                      )}
                      helperText={
                        touched[column.accessorKey] &&
                        errors[column.accessorKey]
                      }
                    >
                      {sections.map((option) => (
                        <MenuItem key={option.name} value={option.name}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                );
              }
              return (
              <TextField
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                value={values[column.accessorKey]}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(
                  touched[column.accessorKey] && errors[column.accessorKey]
                )}
                helperText={
                  touched[column.accessorKey] && errors[column.accessorKey]
                }
              />
            )})}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: "1.25rem" }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button color="secondary" type="submit" name="submitForm" variant="contained">
            Create New Student
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
export default StudentForm;
