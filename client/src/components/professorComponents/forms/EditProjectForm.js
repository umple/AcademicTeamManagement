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

const EditProjectForm = ({
  open,
  columns,
  projectData,
  setEditingRow,
  setEditModalOpen,
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
  const [initialProjectValues, setInit] = useState(
    new Project(projectData.original)
  );

  const handleClose = () => {
    setEditingRow(null);
    setEditModalOpen(false);
    setFieldValue({}); // Clear the form values when closing the form
  };

  const onSubmit = async (values, actions) => {
    try {
      await projectService.update(projectData.original._id,values);
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
    initialValues: initialProjectValues.toProfessorRequestBody(),
    validationSchema: professorProjectSchema,
    onSubmit,
  });

  useEffect(() => {
    if (projectData) {
      Object.keys(projectData.original).forEach((field) => {
        setFieldValue(field, projectData.original[field]);
      });
    }
  }, [projectData]);

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">
        {projectData?.original ? "Update Project" : "Create New Project"}
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
          <Button color="secondary" type="submit" variant="contained">
            {projectData?.original ? "Update Project" : "Create New Project"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditProjectForm;
