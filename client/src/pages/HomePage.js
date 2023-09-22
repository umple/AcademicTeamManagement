import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import { getUserEmail } from '../utils/UserEmail';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(4),
    },
    title:{
        fontSize: '4rem',
        fontWeight: 700,       
    },
    column1: {
        paddingLeft: 50,
    },
    column2: {
        paddingLeft: theme.spacing(2),
    },
    card: {
        borderRadius: theme.shape.borderRadius 
    },
    media: {
        height: 0,
        paddingTop: "75%", // 16:9 aspect ratio
    },
}));
const HomePage = () => {
    const classes = useStyles();
    const [professorEmail, setProfessorEmail] = useState(null);

    // Cache the value of the professor's email
    useEffect(() => {
        getUserEmail()
        .then((email) => {
            setProfessorEmail(email)
        })
        .catch((error) => {
            console.error(error);
        });
    }, [professorEmail]);

    return (
        <div className={classes.root}>
            <Grid container spacing={4} justifyContent="center" alignItems="center">
                <Grid item sm={4} className={classes.column1}>
                    <Typography variant="h3"  className={classes.title} gutterBottom>
                        Academic Team Management
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Managing academic teams for capstone courses at the University of Ottawa
                    </Typography>
                </Grid>
                <Grid item  sm={3} className={classes.column2}>
                    <Card className={classes.card} style={{boxShadow: '0px 3px 5px rgba(0,0,0,0.2)'}}>
                        <CardMedia
                            className={classes.media}
                            image="https://upload.wikimedia.org/wikipedia/en/5/5f/Uottawacoa.svg"
                            title="uottawa logo"
                        />
                    </Card>
                </Grid>
            </Grid>
        </div>

    )
}

export default HomePage