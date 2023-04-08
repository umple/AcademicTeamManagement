// MyGroup.js
import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Grid, Alert, Snackbar } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from "react-router-dom";


const linkStyle = {
  textDecoration: "none",
};

const MyGroup = () => {
  const [group, setGroup] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetch("api/retrieve/curr/user/group")
      .then((response) => {
        if (!response.ok){
          throw new Error("dsaafsd");
        } else {
          return response.json()
        }
      })
      .then((data) => {
        setGroup(data);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleLeaveGroup = async () => {
    fetch("api/remove/group/member", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 4000);
        setGroup({})
      })
      .catch((error) => console.error(error));

  };


  return (
    <Box sx={{ mt: 3 }}>
    <Snackbar open={showAlert} onClose={() => setShowAlert(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert severity="success">
        User has left the team successfully!
      </Alert>
    </Snackbar>
    <Typography variant="h4" gutterBottom>
      My Group
    </Typography>
    { Object.keys(group).length !== 0  ? (
      <Box>
        <Typography variant="h6">Group ID: {group.group_id}</Typography>
        <Typography variant="h6">Members: {group.members  && group.members.join(", ")}</Typography>
        {group.project ? (
          <Typography variant="h6">Project: {group.project}</Typography>
        ) : (
          <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
            <Grid item>
              <Link to="/StudentProjects" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary">
                  Add Project
                </Button>
              </Link>
            </Grid>
            <Grid item>
              <Button variant="contained" color="error" onClick={handleLeaveGroup}>
                Leave Group
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>
    ) : (
      <Typography variant="h6">You have not joined a group yet.</Typography>
    )}
  </Box>

  );
};

export default MyGroup;
