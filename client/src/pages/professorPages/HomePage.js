import React, { useState, useEffect } from "react";
import { Container, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import { getUserEmail } from "../../helpers/UserEmail";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { CardContent } from "@mui/material";
import GroupsSharpIcon from "@mui/icons-material/GroupsSharp";
import ClassIcon from '@mui/icons-material/Class';
import PersonIcon from "@mui/icons-material/Person";
import DesignServicesSharpIcon from "@mui/icons-material/DesignServicesSharp";
import projectService from "../../services/projectService";
import groupService from "../../services/groupService";
import studentService from "../../services/studentService";
import sectionService from "../../services/sectionService";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

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

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const [professorEmail, setProfessorEmail] = useState(null);

  // Cache the value of the professor's email
  useEffect(() => {
    getUserEmail()
      .then((email) => {
        setProfessorEmail(email);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [professorEmail]);

  return (
    <div className={classes.root}>
      <Container className="mb-4">
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          <Grid item sm={4} className={classes.column1}>
            <Typography variant="h3" className={classes.title} gutterBottom>
              {t('common.academic-team-management')}
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
      <DashBoardInfo></DashBoardInfo>
    </div>
  );
};

const DashBoardInfo = () => {
  const [studentsCount, setStudentCount] = useState(0);
  const [groupsCount, setGroupCount] = useState(0);
  const [projectsCount, setProjectCount] = useState(0);
  const [sectionsCount, setSectionsCount] = useState(0);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    studentService.get().then((data) => {
      data.count && setStudentCount(data.count ?? 0);
    });
    groupService.get().then((data) => {
      data.count && setGroupCount(data.count ?? 0);
    });
    projectService.get().then((data) => {
      data.count && setProjectCount(data.count ?? 0);
    });
    sectionService.get().then((data) => {
      data.count && setSectionsCount(data.count ?? 0);
    });
  }, []);

  const cardStyle = {
    height: "200px", // Set the desired height
    borderRadius: "10px", // Add rounded edges
    transition: "box-shadow 0.3s", // Add transition for smooth hover effect
    "&:hover": {
      boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)", // Add box shadow on hover
    },
    cursor: 'pointer', // Add pointer cursor for better UX
    transition: 'transform 0.3s', // Add transition for smooth hover effect
    '&:hover': {
      transform: 'scale(1.05)', // Scale up on hover
    },
  };

  const titleStyle = {
    textAlign: "left", // Align the text to the center
  };

  const iconStyle = {
    fontSize: "120px", // Set the icon size to 120
    marginBottom: "1rem", // Add spacing between the icon and badge
  };

  const contentStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  };

  const badgeStyle = {
    width: "5rem",
    height: "5rem",
    borderRadius: "50%",
    border: "3px solid #575757", // Add border and set the color
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
    marginBottom: "0.5rem", // Add spacing between the badge and text
  };

  const badgeTextStyle = {
    fontWeight: "bold",
  };

  return (
    <Container style={{ marginBottom: "20px", marginTop: "20px" }}>
      <Box
        sx={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Link to="/Projects" style={{ textDecoration: 'none' }}>
              <Card style={cardStyle}>
                <CardContent>
                  <Typography variant="h6" style={titleStyle}>
                    {t('header.navbar.projects')}
                  </Typography>
                  <div style={contentStyle}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4em",
                      }}
                    >
                      <div style={{ float: "left" }}>
                        <DesignServicesSharpIcon style={iconStyle} />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >

                        <div style={badgeStyle}>
                          <Typography style={badgeTextStyle}>
                            {projectsCount}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </Grid>
          <Grid item xs={12} md={6}>
            <Link to="/GroupView" style={{ textDecoration: 'none' }}> 
              <Card style={cardStyle}>
                <CardContent>
                  <Typography variant="h6" style={titleStyle}>
                    {t('header.navbar.groups')}
                  </Typography>
                  <div style={contentStyle}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4em",
                      }}
                    >
                      <div style={{ float: "left" }}>
                        <GroupsSharpIcon style={iconStyle} />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >

                        <div style={badgeStyle}>
                          <Typography style={badgeTextStyle}>
                            {groupsCount}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </Grid>
          <Grid item xs={12} md={6}>
            <Link to="/Students" style={{ textDecoration: 'none' }}>
              <Card style={cardStyle}>
                <CardContent>
                  <Typography variant="h6" style={titleStyle}>
                    {t('header.navbar.students')}
                  </Typography>
                  <div style={contentStyle}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4em",
                      }}
                    >
                      <div style={{ float: "left" }}>
                        <PersonIcon style={iconStyle} />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >

                        <div style={badgeStyle}>
                          <Typography style={badgeTextStyle}>
                            {studentsCount}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </Grid>
          <Grid item xs={12} md={6}>
            <Link to="/Sections" style={{ textDecoration: 'none' }}>
              <Card style={cardStyle}>
                <CardContent>
                  <Typography variant="h6" style={titleStyle}>
                    {t('header.navbar.sections')}
                  </Typography>
                  <div style={contentStyle}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4em",
                      }}
                    >
                      <div style={{ float: "left" }}>
                        <ClassIcon style={iconStyle} />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >

                        <div style={badgeStyle}>
                          <Typography style={badgeTextStyle}>
                            {sectionsCount}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;
