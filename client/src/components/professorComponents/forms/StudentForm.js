import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  TextField,
  DialogActions,
} from "@mui/material";
import React, { useState } from "react";
import { useFormik } from "formik";
import studentService from "../../../services/studentService";
import Student from "../../../entities/Student";
import studentSchema from "../../../schemas/studentSchema";

const StudentForm = ({
  open,
  columns,
  setCreateModalOpen,
  fetchStudents,
  update,
  setUpdate,
  editingRow,
  students,
  setEditingRow,
}) => {
  const onSubmit = async (values, actions) => {
    try {
      let response;
      if (update) {
        response = await studentService.update(editingRow._id, values);
      } else {
        response = await studentService.add(values);
      }
      fetchStudents();
    } catch (error) {
      console.log(error);
    }
    actions.resetForm();
    handleClose();
  };

  const handleClose = () => {
    setCreateModalOpen(false);
    setUpdate(false);
    setEditingRow({});
  };

  const [initialStudentValues] = useState(
    update
      ? new Student(editingRow)
      : new Student({
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
    validationSchema: studentSchema(students,editingRow._id),
    onSubmit,
  });
  return (
    <Dialog open={open || update}>
      <DialogTitle textAlign="center">
        {update ? "Edit Student" : "Create New Student"}
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
            {columns.map((column) => (
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
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: "1.25rem" }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button color="secondary" type="submit" name="submitForm" variant="contained">
            {update ? "Edit Student" : "Create New Student"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
export default StudentForm;
