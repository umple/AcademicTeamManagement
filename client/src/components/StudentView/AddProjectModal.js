import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Project from "../../entities/Project";
import projectService from "../../services/projectService";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "32px",
    marginBottom: "32px",
  },
  root: {
    margin: "1rem",
    minWidth: 350,
  },
  button: {
    marginTop: "1rem",
  },
  addButton: {
    marginTop: "3rem",
  },
  container: {
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  bold: {
    fontWeight: "bold",
  },
  status: {
    borderRadius: "0.25rem",
    color: "#fff",
    maxWidth: "9ch",
    padding: "0.25rem",
  },
  new: {
    backgroundColor: "#4caf50",
  },
  interested: {
    backgroundColor: "#ff9800",
  },
  needed: {
    backgroundColor: "#2196f3",
  },
  approval: {
    backgroundColor: "#3f51b5",
  },
  assigned: {
    backgroundColor: "#f44336",
  },
  proposed: {
    backgroundColor: "#ef6694",
  },
  info: {
    backgroundColor: "#2196f3",
  },
  modal: {
    position: "absolute",
    width: "600px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    borderRadius: "0.5rem",
    boxShadow: 24,
    p: 4,
  },
  textField: {
    "& .MuiInputLabel-root": {
      color: "#6b6b6b",
      fontWeight: "bold",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#c8c8c8",
      },
      "&:hover fieldset": {
        borderColor: "#afafaf",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#2196f3",
      },
    },
  },
}));

function AddProjectModal({
  open,
  onClose,
  fetchProjects,
  professorEmail,
  currentGroup,
}) {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [client, setClient] = useState("");
  const [clientEmail, setClientEmail] = useState("");
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
          <Button
            color="secondary"
            type="submit" // Use type="submit" to trigger the form submission
            variant="contained"
          >
            Add Project
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AddProjectModal;
