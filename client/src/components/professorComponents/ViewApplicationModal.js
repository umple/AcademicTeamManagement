import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, Typography,
  Grid, FormLabel,
  FormGroup,
  Select,
  MenuItem,
  InputLabel,
  TextareaAutosize
} from "@mui/material";

const ViewApplicationModal = ({
    open,
    data,
    onClose,
    onSubmit,
    setShowAlert,
    project,
    fetchApplications,
  }) => {
    const [textFieldFeedback, setTextFieldtextFieldFeedback] = useState("");
    const [status, setStatus] = useState(data.status ?? "Feedback Provided");
  
    let states = ["Accepted", "Rejected", "Feedback Provided"];
  
    const handleStatusChange = (e) => {
      setStatus(e.target.value);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      data.status = status;
      data.feedback = textFieldFeedback
      fetch("api/application/review", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          fetchApplications();
          setShowAlert(true); 
          setTimeout(() => setShowAlert(false), 5000);
        });
      onSubmit();
      onClose();
    };
  
    return (
      <Dialog open={open}>
        <DialogTitle>Project Application: </DialogTitle>
        <form acceptCharset="Enter" onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <FormLabel component="legend">
                  <Typography variant="body1" gutterBottom>
                    <Box fontWeight="fontWeightMedium" display="inline">
                      Group:{" "}
                    </Box>
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <Box display="center">{data.group_id}</Box>
                  </Typography>
                </FormLabel>
              </Grid>
            </Grid>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <FormLabel component="legend">
                  <Typography variant="body1" gutterBottom>
                    <Box fontWeight="fontWeightMedium" display="inline">
                      submitted_by:{" "}
                    </Box>
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <Box display="center">{data.submitted_by} </Box>
                  </Typography>
                </FormLabel>
              </Grid>
            </Grid>
            <Grid>
              <FormGroup>
                <InputLabel id="status-label">Status</InputLabel>
                <Select 
                    labelId="status-label" 
                    defaultValue={status}
                    disabled={data.status == "Accepted"}
                    onChange={handleStatusChange}>
                  {states.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </Select>
              </FormGroup>
            </Grid>
            <FormLabel component="legend" sx={{ mt: 1 }}>
              <Box fontWeight="fontWeightMedium" display="inline">
                Feedback:{" "}
              </Box>
            </FormLabel>
            <FormGroup row>
              <TextareaAutosize
                style={{
                  height: "calc(1.5em + 100px)",
                  width: "calc(1.5em + 250px)",
                }}
                name="feedback"
                multiline={4}
                value={textFieldFeedback}
                onChange={(e) => {
                  setTextFieldtextFieldFeedback(e.target.value);
                }}
              />
            </FormGroup>
          </DialogContent>
          <DialogActions sx={{ p: "1.25rem" }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              color="secondary"
              type="submit"
              onClick={handleSubmit}
              variant="contained"
            >
              Review Application
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  };
export default ViewApplicationModal;