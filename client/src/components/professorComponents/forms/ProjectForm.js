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
} from "@mui/material";
import Project from "../../../entities/Project";
import { useFormik } from "formik";
import projectService from "../../../services/projectService";
import professorProjectSchema from "../../../schemas/professorProjectSchema";

const ProjectForm = ({
  open,
  columns,
  setCreateModalOpen,
  setRefreshTrigger,
}) => {
  const cellValueMap = [
    { value: "new", label: "success" },
    { value: "interested students", label: "warning" },
    { value: "students needed", label: "primary" },
    { value: "pending approval", label: "secondary" },
    { value: "assigned", label: "error" },
    { value: "proposed", label: "default" },
  ];
  const [initialProjectValues] = useState(
    new Project({
      professorEmail: JSON.parse(localStorage.getItem("userEmail")),
    })
  );

  const handleClose = () => {
    setCreateModalOpen(false);
  };

  const onSubmit = async (values, actions) => {
    try {
      await projectService.add(values);
      setRefreshTrigger((prevState) => !prevState);
      handleClose();
      actions.resetForm();
    } catch (error) {
      console.error(error);
    } finally {
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
    initialValues: initialProjectValues.toProfessorRequestBody(),
    validationSchema: professorProjectSchema,
    onSubmit,
  });

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Project</DialogTitle>
      <form name="project-form" onSubmit={handleSubmit} acceptCharset="Enter">
        <DialogContent>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            {columns.map((column) => {
              if (
                column.accessorKey === "interested groups" ||
                column.accessorKey === "group"
              ) {
                return null;
              }
              if (column.accessorKey === "status") {
                return (
                  <FormGroup>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                      labelId="status-label"
                      key={column.accessorKey}
                      label={column.header}
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
                      {cellValueMap.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormGroup>
                );
              }
              return (
                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  value={values[column.accessorKey]}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(
                    touched[column.accessorKey] && errors[column.accessorKey]
                  )}
                  helperText={
                    touched[column.accessorKey] && errors[column.accessorKey]
                  }
                  multiline={column.accessorKey === "description"}
                  rows={column.accessorKey === "description" ? 5 : 1}
                />
              );
            })}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: "1.25rem" }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button color="secondary" name="submitForm" type="submit" variant="contained">
            Create New Project
          </Button>
        </DialogActions>
      </form>
    </Dialog>

  );
};

export default ProjectForm;
