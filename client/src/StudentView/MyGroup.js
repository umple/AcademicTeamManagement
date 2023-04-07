// MyGroup.js
import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from "react-router-dom";
const MyGroup = () => {
  const [group, setGroup] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Make API call to get group information
    fetch("api/retrieve/curr/user/group")
      .then((response) => response.json())
      .then((data) => {
        setGroup(data);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

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
            <Box sx={{ mt: 2 }}>
              <Link to="/StudentProjects"  style={{ textDecoration: "none" }}>
                <Button variant="contained" color="primary"  >
                  Add Project
                </Button>
              </Link>
            </Box>
          )}
        </Box>
      ) : (
        <Typography variant="h6">You have not joined a group yet.</Typography>
      )}
    </Box>

  );
};

export default MyGroup;
