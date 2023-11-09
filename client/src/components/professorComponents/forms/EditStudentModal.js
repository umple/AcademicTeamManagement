//Modal to create new project
import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  FormGroup,
  Select,
  MenuItem,
  InputLabel,
  Alert,
  FormControl,
} from "@mui/material";
import { useFormik } from "formik";
import studentService from "../../../services/studentService";
import Student from "../../../entities/Student";
import studentSchema from "../../../schemas/studentSchema";
import sectionService from "../../../services/sectionService";

const EditStudentForm = ({
  open,
  columns,
  studentData,
  setEditingRow,
  setEditModalOpen,
  setRefreshTrigger,
  students
}) => {
  const [initialStudentValues, setInit] = useState(
    new Student(studentData.original)
  );

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

  const handleClose = () => {
    setEditingRow(null);
    setEditModalOpen(false);
    setFieldValue({}); // Clear the form values when closing the form
  };

  const onSubmit = async (values, actions) => {
    try {
      await studentService.update(studentData.original._id,values);
      setRefreshTrigger((prevState) => !prevState);
    } catch (error) {
      console.error(error);
    } finally {
      handleClose();
      actions.resetForm();
    }
  };

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
    validationSchema: studentSchema(students, studentData.original._id),
    onSubmit,
  });

  useEffect(() => {
    if (studentData) {
      Object.keys(studentData.original).forEach((field) => {
        setFieldValue(field, studentData.original[field]);
      });
    }
  }, [studentData]);

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">
        {studentData?.original ? "Update Student" : "Create New Student"}
      </DialogTitle>
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
              if (column.accessorKey === "orgdefinedid" || column.accessorKey === "email") {
                return (
                <TextField
                    key={column.accessorKey}
                    label={column.header}
                    name={column.accessorKey}
                    value={values[column.accessorKey]}
                    disabled={true} // don't allow chnging those fields
                />
                )
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
          <Button color="secondary" type="submit" variant="contained">
            {studentData?.original ? "Update Student" : "Create New Student"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditStudentForm;
