

//Modal to create new project
import React, { useState } from "react";
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

const EditProjectModal = ({
    open,
    columns,
    onClose,
    fetchApplications,
    handleSaveRowEdits,
    projects,
    editingRow,
    values,
    setValues,
  }) => {
    const cellValueMap = [
      { value: "new", label: "success" },
      { value: "interested students", label: "warning" },
      { value: "students needed", label: "primary" },
      { value: "pending approval", label: "secondary" },
      { value: "assigned", label: "error" },
      { value: "proposed", label: "default" },
    ];
  
    const [error, setError] = useState("");
  

  
    const handleSubmit = (e) => {
      e.preventDefault();
  
  
      handleSaveRowEdits(editingRow, values);
      onClose();
    };
  
    return (
      <Dialog open={open}>
        {error === "" ? "" : <Alert severity="error">{error}</Alert>}
        <DialogTitle textAlign="center">Edit Project</DialogTitle>
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
                        onChange={(e) => {
                          setValues({
                            ...values,
                            [e.target.name]: e.target.value,
                          });
                        }}
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
                    onChange={(e) => {
                      setValues({ ...values, [e.target.name]: e.target.value });
                    }}
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
              Edit Project
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  };
export default EditProjectModal;