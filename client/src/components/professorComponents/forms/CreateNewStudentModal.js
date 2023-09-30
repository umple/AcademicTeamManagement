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
import studentService from "../../../services/studentService";

export const CreateNewStudentModal = ({
  open,
  columns,
  onClose,
  onSubmit,
  fetchStudents,
}) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );

  const handleSubmit = async () => {
    const professorEmail = JSON.parse(localStorage.getItem("userEmail")); // get the cached value of the professor's email
    const newStudentInfo = { ...values, professorEmail: professorEmail }; // add the professor's email as a new pair

    try {
      let response = await studentService.add(newStudentInfo);
      if (response.success) {
        fetchStudents();
      }
    } catch (error) {
      console.log(error);
    }

    onSubmit(newStudentInfo);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Student</DialogTitle>
      <form onSubmit={(e) => e.preventDefault()}>
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
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: "1.25rem" }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="secondary" onClick={handleSubmit} variant="contained">
            Create New Student
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
