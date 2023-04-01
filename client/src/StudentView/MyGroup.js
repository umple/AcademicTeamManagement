// MyGroup.js
import React from "react";
import { Box, Button, Typography } from "@mui/material";

const MyGroup = ({ group, onJoinProject }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Group
      </Typography>
      {group ? (
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
