import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import Project from "../../../entities/Project";
import projectSchema from "../../../schemas/projectSchema";
import projectService from "../../../services/projectService";
import { useStyles } from "../styles/AddProjectModalStyles";

function AddProjectModal({ open, onClose, professorEmail, group }) {
  const classes = useStyles();
  const [confirmationMessage, setConfirmationMessage] = useState(""); // State for the confirmation message
  const [error, setError] = useState(""); // State for the confirmation message
  let obj = {
    professorEmail: professorEmail,
    group: group,
  };

  const [project] = useState(new Project(obj));
  const onSubmit = async (values, actions) => {
    if (values.group === null) {
      setError("You Need to be in a group to propose a project!"); // Set confirmation message
      return;
    }
    try {
      values.status = "Proposed"
      let response = await projectService.add(values);
      setConfirmationMessage(response.message);
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setTimeout(() => {
        setConfirmationMessage("");
        setError("");
      }, 5000);
    }
    actions.resetForm();
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
    initialValues: project.toRequestBody(),
    validationSchema: projectSchema,
    onSubmit,
  });

  return (
    <Dialog open={open}>
      {error && <Alert severity="error">{error}</Alert>}
      {confirmationMessage && <Alert> {confirmationMessage}</Alert>}
      <DialogTitle
        sx={{ fontWeight: "bold", fontSize: "1.5rem", textAlign: "center" }}
      >
        Add Project
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
            <TextField
              fullWidth
              label="Project Title"
              name="project"
              onBlur={handleBlur}
              value={values.project}
              onChange={handleChange}
              variant="outlined"
              error={Boolean(touched.project && errors.project)}
              helperText={touched.project && errors.project}
              className={classes.textField}
            />
            <TextField
              fullWidth
              name="description"
              label="Description"
              value={values.description}
              error={Boolean(touched.description && errors.description)}
              helperText={touched.description && errors.description}
              onBlur={handleBlur}
              onChange={handleChange}
              variant="outlined"
              className={classes.textField}
              multiline
              rows={4}
            />
            <TextField
              fullWidth
              name="clientName"
              label="Client Full Name"
              value={values.clientName}
              onBlur={handleBlur}
              onChange={handleChange}
              error={Boolean(touched.clientName && errors.clientName)}
              helperText={touched.clientName && errors.clientName}
              variant="outlined"
              className={classes.textField}
            />

            <TextField
              fullWidth
              name="clientEmail"
              label="Client Email"
              value={values.clientEmail}
              onBlur={handleBlur}
              onChange={handleChange}
              error={Boolean(touched.clientEmail && errors.clientEmail)}
              helperText={touched.clientEmail && errors.clientEmail}
              variant="outlined"
              className={classes.textField}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: "1.25rem" }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="secondary" type="submit" variant="contained">
            Add Project
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AddProjectModal;
