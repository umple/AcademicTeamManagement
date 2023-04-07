// MyGroup.js
import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";

const MyGroup = ({ onJoinProject }) => {
  const [group, setGroup] = useState(null);
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
        <Typography variant="h6">Loading group information...</Typography>
      ) : group ? (
        <Box>
          <Typography variant="h6">Group ID: {group.groupId}</Typography>
          <Typography variant="h6">Members: {group.members.join(", ")}</Typography>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={onJoinProject}>
              Join Project
            </Button>
          </Box>
        </Box>
      ) : (
        <Typography variant="h6">You have not joined a group yet.</Typography>
      )}
    </Box>
  );
};

export default MyGroup;
