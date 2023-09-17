import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Stack, TextField, Button, Alert } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    formContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '32px',
      marginBottom: '32px',
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

function AddProjectModal({ open, onClose, fetchProjects, currentGroup }) {
    const classes = useStyles();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [client, setClient] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [confirmationMessage, setConfirmationMessage] = useState(""); // State for the confirmation message
  
    const handleSubmit = (event) => {
      event.preventDefault();
      if (currentGroup === null){
        setConfirmationMessage("You Need to be in a group to propose a project!"); // Set confirmation message
        setTimeout(() => {
          setConfirmationMessage(""); // Clear the confirmation message after a few seconds
          onClose(); // Close the dialog
        }, 1500); // Adjust the time as needed
        return
      }
      let project = {
        project: name,
        description: description,
        clientName: client,
        clientEmail: clientEmail,
        status: "proposed",
        group: currentGroup,
      };
  
      fetch("/api/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      })
        .then((response) => {
          if (response.ok) {
            fetchProjects();
            setConfirmationMessage("Project added successfully!"); // Set confirmation message
            setTimeout(() => {
              setConfirmationMessage(""); // Clear the confirmation message after a few seconds
              onClose(); // Close the dialog
            }, 1500); // Adjust the time as needed
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };
  
    return (
      <Dialog open={open}>
        {confirmationMessage === "You Need to be in a group to propose a project!" &&  <Alert severity = "error" >{confirmationMessage}</Alert>} 
        {confirmationMessage === "Project added successfully!" &&  <Alert> {confirmationMessage}</Alert>} 
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
                value={name}
                onChange={(event) => setName(event.target.value)}
                variant="outlined"
                className={classes.textField}
              />
              <TextField
                fullWidth
                required
                label="Description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                variant="outlined"
                className={classes.textField}
                multiline
                rows={4}
              />
              <TextField
                fullWidth
                required
                label="Client Full Name"
                value={client}
                onChange={(event) => setClient(event.target.value)}
                variant="outlined"
                className={classes.textField}
              />
              <TextField
                fullWidth
                required
                label="Client Email"
                value={clientEmail}
                onChange={(event) => setClientEmail(event.target.value)}
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