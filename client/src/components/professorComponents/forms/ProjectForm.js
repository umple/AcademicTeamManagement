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
  onClose,
  projectData,
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
  const [project, setProject] = useState(new Project({
    professorEmail: JSON.parse(localStorage.getItem("userEmail")),
  }));

  useEffect(() => {
    if (projectData) {
      setProject(new Project(projectData.original));
    } else {
      setProject(
        new Project({
          professorEmail: JSON.parse(localStorage.getItem("userEmail")),
        })
      );
    }
    console.log("HI", projectData)
  }, [projectData]); // Watch for changes in projectData prop

  const onSubmit = async (values, actions) => {
    try {
      let response = await projectService.add(values);
      setRefreshTrigger((prevState) => !prevState);
    } catch (error) {
      console.error(error);
    } finally {
      onClose();
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
    initialValues: project?.toProfessorRequestBody(),
    validationSchema: professorProjectSchema,
    onSubmit,
  });

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Project</DialogTitle>
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
          <Button onClick={onClose}>Cancel</Button>
          <Button color="secondary" type="submit" variant="contained">
            Create New Project
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProjectForm;
