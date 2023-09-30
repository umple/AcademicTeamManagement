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
import React, { useState } from "react";
import Project from "../../entities/Project";
import projectService from "../../services/projectService";
import { useStyles } from "./styles/AddProjectModalStyles";

function AddProjectModal({ open, onClose, professorEmail, currentGroup }) {
  const classes = useStyles();
  const [confirmationMessage, setConfirmationMessage] = useState(""); // State for the confirmation message
  const [error, setError] = useState(""); // State for the confirmation message

  const [project, setProject] = useState(
    new Project({ professorEmail: professorEmail, currentGroup: currentGroup })
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (currentGroup === null) {
      setError("You Need to be in a group to propose a project!"); // Set confirmation message
      return;
    }
    try {
      let response = await projectService.add(project);
      setConfirmationMessage(response.message);
      onClose()
    } catch (error) {
      setError(error.message);
    } finally {
      setTimeout(() => {
        setConfirmationMessage("");
        setError("");
      }, 5000);
    }
  };

  const handleInputChange = (event) => {
    const fieldName = event.target.name;
    setProject({
      ...project,
      [fieldName]: event.target.value,
    });
  };

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
              required
              label="Project Title"
              value={project.name}
              name="name"
              onChange={handleInputChange}
              variant="outlined"
              className={classes.textField}
            />
            <TextField
              fullWidth
              required
              name="description"
              label="Description"
              value={project.description}
              onChange={handleInputChange}
              variant="outlined"
              className={classes.textField}
              multiline
              rows={4}
            />
            <TextField
              fullWidth
              required
              name="client"
              label="Client Full Name"
              value={project.client}
              onChange={handleInputChange}
              variant="outlined"
              className={classes.textField}
            />
            <TextField
              fullWidth
              required
              name="clientEmail"
              label="Client Email"
              value={project.clientEmail}
              onChange={handleInputChange}
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
