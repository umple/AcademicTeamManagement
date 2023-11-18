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
  TextareaAutosize,
  Stack,
  TextField
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
    const [textFieldFeedback, setTextFieldtextFieldFeedback] = useState(data.feedback ?? "");
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
        <DialogTitle textAlign="center">Project Application</DialogTitle>
        <form acceptCharset="Enter" onSubmit={handleSubmit}>
          <DialogContent>
            <Stack
              sx={{
                width: "100%",
                minWidth: { xs: "300px", sm: "360px", md: "400px" },
                gap: "1.5rem",
              }}
            >
              <Box>
                <InputLabel id="group-label">Group</InputLabel>
                <TextField
                  disabled
                  fullWidth
                  name={"group_id"}
                  value={data.group_id}
                  rows={1}
                />
              </Box>
              <Box>
                <InputLabel id="submitted-by-label">Submitted By</InputLabel>
                <TextField
                  disabled
                  fullWidth
                  name={"submitted_by"}
                  value={data.submitted_by}
                  rows={1}
                />
              </Box>
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
              <Box>
                <InputLabel id="feedback-label">Feedback</InputLabel>
                <TextField
                  name={"feedback"}
                  multiline
                  fullWidth
                  rows={5}
                  placeholder="Insert Feedback Here"
                  defaultValue={textFieldFeedback}
                  value={textFieldFeedback}
                  onChange={(e) => {
                    setTextFieldtextFieldFeedback(e.target.value);
                  }}
                />
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: "1.25rem" }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              color="secondary"
              type="submit"
              onClick={handleSubmit}
              variant="contained"
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  };
export default ViewApplicationModal;