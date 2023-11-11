import { useState } from "react";
import { useStyles } from "./styles/StudentProjectStyles";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import projectService from "../../services/projectService";
const ProjectCard = ({
  project,
  setShowAlert,
  currentGroup,
  setErrorShowAlert,
}) => {
  const classes = useStyles();
  const handleProjectApplication = async (event) => {
    event.preventDefault();

    let body = {
      project_name: project.project,
      project_id: project._id,
      group_id: currentGroup,
    };

    try {
      let response = await projectService.requestToJoinProject(body);
      if (response.success) {
        setShowAlert(true);
      }
    } catch (error) {
      setErrorShowAlert(true);
    } finally {
      setTimeout(() => setErrorShowAlert(false), 3000);
    }
  };
  return (
    <form
      className={classes.formContainer}
      onSubmit={(event) => handleProjectApplication(event)}
    >
      <Grid key={project.id}>
        <Card className={classes.root} style={{ padding: "1rem" }}>
          <CardContent>
            <Typography variant="h5" component="h2" className={classes.bold}>
              {project.project}
            </Typography>
            <Typography
              variant="body2"
              component="p"
              style={{ marginTop: "1rem" }}
            >
              {project.description}
            </Typography>
            <Typography
              variant="body2"
              component="p"
              style={{ marginTop: "1rem" }}
            >
              <span className={classes.bold}>Client Name:</span>{" "}
              {project.clientName}
            </Typography>
            <Typography variant="body2" component="p">
              <span className={classes.bold}>Client Email:</span>{" "}
              {project.clientEmail}
            </Typography>
            <Typography variant="body2" component="p">
              <span className={classes.bold}>Status:</span>{" "}
              <Box
                component="span"
                className={`${classes.status} ${
                  project.status === "Available"
                    ? classes.Available
                    : project.status === "Underway"
                    ? classes.Underway
                    : project.status === "Completed"
                    ? classes.Completed
                    : project.status === "Cancelled"
                    ? classes.Cancelled
                    : project.status === "Proposed"
                    ? classes.Proposed
                    : classes.info
                }`}
              >
                {project.status}
              </Box>
            </Typography>
            <Typography variant="body2" component="p">
              <span className={classes.bold}>Group:</span> {project.group}
            </Typography>
            <Button
              variant="text"
              color="primary"
              type="sumbit"
              disabled={
                project.status !== "Available" || currentGroup === null
              }
              className={classes.button}
              style={{ marginTop: "1rem" }}
            >
              REQUEST
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </form>
  );
};

export default ProjectCard;
