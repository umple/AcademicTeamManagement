// Imports
import React, { useState, useEffect } from 'react';
import {
    makeStyles,
    Grid,
    Typography,
  } from "@material-ui/core";
  
  // Styles
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      padding: theme.spacing(4),
      backgroundColor: '#f5f5f5',
    },
    title: {
      fontSize: "4rem",
      fontWeight: 700,
    },
    column1: {
      paddingLeft: 50,
    },
    welcomeText: {
      fontSize: '2rem',
      fontWeight: 500,
      color: '#616161',
    },
  }));
  
  // StudentHomePage Component
  function StudentHomePage() {
    const classes = useStyles();
    const [userName, setUserName] = useState("student");

    useEffect(() => {
      // Get user name information from the /getusername endpoint
      fetch(`http://localhost:${process.env.REACT_APP_FLASK}/getusername`, {
        method: 'GET',
        credentials: 'include' // include cookies in the request
      })
        .then(response => response.json())
        .then(data => {
          if (data.username) setUserName(data.username);
        });
    }, [setUserName])
  
    return (
      <div className={classes.root}>
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          <Grid item sm={6} className={classes.column1}>
            <Typography variant="h3" className={classes.title} gutterBottom>
              Academic Team Management
            </Typography>
            <Typography variant="h2" className={classes.welcomeText} gutterBottom>
              Welcome {userName}!
            </Typography>
          </Grid>
        </Grid>
      </div>
    );
  }
  
  export default StudentHomePage;
  