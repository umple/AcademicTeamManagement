// MyGroup.js
import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from "react-router-dom";


const linkStyle = {
  textDecoration: "none",
};

const MyGroup = () => {
  const [group, setGroup] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Make API call to get group information
    fetch("api/retrieve/curr/user/group")
    .then((response) => {
      if (!response.ok) {
        setGroup(null);
        setLoading(false);
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
      .then((data) => {
        setGroup(data);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleLeaveGroup = async () => {
    fetch("api/remove/group/member")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setGroup(data);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  };


  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Group
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : group ? (
        <Box>
          <Typography variant="h6">Group ID: {group.group_id}</Typography>
          <Typography variant="h6">Members: {group.members.join(", ")}</Typography>
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
