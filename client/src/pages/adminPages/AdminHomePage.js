import React, { useState, useEffect } from "react";
import { Container, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import { getUserEmail } from "../../helpers/UserEmail";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(4),
  },
  title: {
    fontSize: "4rem",
    fontWeight: 700,
  },
  column1: {
    paddingLeft: 50,
  },
  column2: {
    paddingLeft: theme.spacing(2),
  },
  card: {
    borderRadius: theme.shape.borderRadius,
  },
  media: {
    height: 0,
    paddingTop: "75%", // 16:9 aspect ratio
  },
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const AdminHomePage = () => {
  const classes = useStyles();
  const [adminEmail, setAdminEmail] = useState(null);

  // Cache the value of the professor's email
  useEffect(() => {
    getUserEmail()
      .then((email) => {
        setAdminEmail(email);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [adminEmail]);

  return (
    <div className={classes.root}>
      <Container className="mb-4">
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          <Grid item sm={4} className={classes.column1}>
            <Typography variant="h3" className={classes.title} gutterBottom>
              Academic Team Management
            </Typography>
            <Typography variant="body1" gutterBottom>
              Managing academic teams for capstone courses at the University of
              Ottawa
            </Typography>
          </Grid>
          <Grid item sm={3} className={classes.column2}>
            <Card
              className={classes.card}
              style={{ boxShadow: "0px 3px 5px rgba(0,0,0,0.2)" }}
            >
              <CardMedia
                className={classes.media}
                image="https://upload.wikimedia.org/wikipedia/en/5/5f/Uottawacoa.svg"
                title="uottawa logo"
              />
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default AdminHomePage;
