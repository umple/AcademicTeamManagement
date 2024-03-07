import React, { useState, useEffect } from 'react'
<<<<<<< HEAD
import ResponsiveAppBar from '../../components/StaticComponents/NavBar/ResponsiveAppBar'
import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@mui/material/Card'
import { CardContent } from '@mui/material'
import GroupsSharpIcon from '@mui/icons-material/GroupsSharp'
import ClassIcon from '@mui/icons-material/Class'
import Tooltip from '@mui/material/Tooltip'
=======
import { Container, Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import { getUserEmail } from '../../helpers/UserEmail'
import { getUserType } from '../../helpers/UserType'
import { getUserLinkedProfessor } from '../../helpers/UserLinkedProfessor'
import Box from '@mui/material/Box'
import { CardContent } from '@mui/material'
import GroupsSharpIcon from '@mui/icons-material/GroupsSharp'
import ClassIcon from '@mui/icons-material/Class'
>>>>>>> a4e2fed (fixed merge errors)
import PersonIcon from '@mui/icons-material/Person'
import DesignServicesSharpIcon from '@mui/icons-material/DesignServicesSharp'
import projectService from '../../services/projectService'
import groupService from '../../services/groupService'
import studentService from '../../services/studentService'
import sectionService from '../../services/sectionService'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
<<<<<<< HEAD
import styled from 'styled-components'
=======
import { FilterDataByProfessor } from '../../helpers/FilterDataByProfessor'
import Footer from '../../components/common/Footer'
>>>>>>> a4e2fed (fixed merge errors)

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
<<<<<<< HEAD
    minHeight: '100vh',
    width: '100vw',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    padding: 0
  },
  leftSection: {
    backgroundColor: '#8f001a',
    minHeight: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    color: '#fff',
    padding: theme.spacing(4),
    paddingLeft: '80px'
  },
  rightSection: {
    backgroundColor: '#212121',
    minHeight: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4)
  },
  title: {
    fontSize: '5rem',
    fontWeight: 700,
    textAlign: 'left',
    lineHeight: '1.2'
  },
  cardStyle: {
    height: '220px',
    width: '220px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    transition: 'box-shadow 0.3s',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    border: '1px solid #e0e0e0',
    '&:hover': {
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      transform: 'scale(1.05)'
    }
  },
  iconStyle: {
    fontSize: '90px',
    color: '#000'
  },
  badgeStyle: {
    fontWeight: 'bold',
    marginTop: theme.spacing(1),
    fontSize: '1.5rem',
    color: '#8f001a'
  },
  numberStyle: {
    color: '#8f001a',
    fontWeight: 'bold',
    fontSize: '2.5rem',
    marginTop: theme.spacing(1)
  },
  contentStyle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: theme.spacing(3)
  },
  customTooltip: {
    fontSize: '16px',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    color: '#fff',
    padding: '12px 16px',
    borderRadius: '8px',
    maxWidth: '200px',
    textAlign: 'center',
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.3)'
  },
  customTooltipArrow: {
    color: 'rgba(0, 0, 0, 0.85)'
  },
  dashboardCard: {
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)'
    }
  }
}))

const FooterContainer = styled.footer`
  background-color: #2c3e50;
  color: #ecf0f1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  flex-wrap: nowrap;
  font-family: 'Helvetica', 'Arial', sans-serif;
  white-space: nowrap;
  overflow-x: auto;
`

const ProfessorHomePage = () => {
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <div>
      <ResponsiveAppBar />
      <div className={classes.root}>
        <Grid container style={{ height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
          <Grid item xs={12} sm={6} className={classes.leftSection}>
            <Typography variant="h2" className={classes.title}>
              {t('common.academic-team-management')}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.rightSection}>
            <DashBoardInfo />
          </Grid>
        </Grid>
      </div>
      <FooterContainer>
        © {new Date().getFullYear()} Academic Team Management. This project is open source. For contributions, visit our
        <a href='https://github.com/umple/AcademicTeamManagement/wiki' style={{ color: '#3498db', textDecoration: 'none', marginLeft: '5px' }}>
          GitHub repository
        </a>.
      </FooterContainer>
=======
    padding: theme.spacing(4)
  },
  title: {
    fontSize: '4rem',
    fontWeight: 700
  },
  column1: {
    paddingLeft: 50
  },
  column2: {
    paddingLeft: theme.spacing(2)
  },
  card: {
    borderRadius: theme.shape.borderRadius
  },
  media: {
    height: 0,
    paddingTop: '75%' // 16:9 aspect ratio
  }
}))

// Styles
const FooterContainer = styled.footer`
  background-color: #2c3e50;
  color: #ecf0f1;
  display: flex; // Use flexbox for layout
  justify-content: center; // Center content horizontally
  align-items: center; // Align items vertically
  padding: 20px;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  flex-wrap: nowrap; // Prevent wrapping by default
  font-family: 'Helvetica', 'Arial', sans-serif;
  white-space: nowrap; // Prevent wrapping at the whitespace in the content
  overflow-x: auto; // Allow horizontal scrolling if content is too wide
`

const HomePage = () => {
  const { t } = useTranslation()
  const classes = useStyles()
  const [professorEmail, setProfessorEmail] = useState(null)

  const fetchUserEmail = async () => {
    try {
      const type = await getUserType()

      if (type === 'TA') {
        const email = await getUserLinkedProfessor()
        setProfessorEmail(email)
      } else {
        const email = await getUserEmail()
        setProfessorEmail(email)
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Cache the value of the professor's email
  useEffect(() => {
    fetchUserEmail()
  }, [professorEmail])

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
              style={{ boxShadow: '0px 3px 5px rgba(0,0,0,0.2)' }}
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
      { professorEmail && (
        <DashBoardInfo professorEmail={professorEmail}></DashBoardInfo>
      )}
>>>>>>> a4e2fed (fixed merge errors)
    </div>
  )
}

<<<<<<< HEAD
const DashBoardInfo = () => {
  const classes = useStyles()
=======
const DashBoardInfo = ({ professorEmail }) => {
>>>>>>> a4e2fed (fixed merge errors)
  const [studentsCount, setStudentCount] = useState(0)
  const [groupsCount, setGroupCount] = useState(0)
  const [projectsCount, setProjectCount] = useState(0)
  const [sectionsCount, setSectionsCount] = useState(0)
  const { t } = useTranslation()
<<<<<<< HEAD
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    studentService.get().then((data) => {
      data.count && setStudentCount(data.count ?? 0)
    })
    groupService.get().then((data) => {
      data.count && setGroupCount(data.count ?? 0)
    })
    projectService.get().then((data) => {
      data.count && setProjectCount(data.count ?? 0)
    })
=======

  // get students
  const fetchStudents = async () => {
    try {
      const students = await studentService.get()

      if (students.students) {
        const filteredStudentsTableData = FilterDataByProfessor(
          students.students,
          professorEmail
        ) // keep only the data that contains the professor's email
        setStudentCount(filteredStudentsTableData.length ?? 0)
      }
    } catch (error) {
      console.error('There was a problem with the network request:', error)
    }
  }

  // get projects
  const fetchProjects = async () => {
    try {
      const projects = await projectService.get()

      if (projects.projects) {
        const filteredProjectsTableData = FilterDataByProfessor(
          projects.projects,
          professorEmail
        ) // keep only the data that contains the professor's email
        setProjectCount(filteredProjectsTableData.length ?? 0)
      }
    } catch (error) {
      console.error('There was a problem with the network request:', error)
    }
  }

  // get groups
  const fetchGroups = async () => {
    try {
      const groups = await groupService.get()

      if (groups.groups) {
        const filteredGroupsTableData = FilterDataByProfessor(
          groups.groups,
          professorEmail
        ) // keep only the data that contains the professor's email
        setGroupCount(filteredGroupsTableData.length ?? 0)
      }
    } catch (error) {
      console.error('There was a problem with the network request:', error)
    }
  }

  useEffect(() => {
    fetchStudents()
    fetchGroups()
    fetchProjects()

>>>>>>> a4e2fed (fixed merge errors)
    sectionService.get().then((data) => {
      data.count && setSectionsCount(data.count ?? 0)
    })
  }, [])

<<<<<<< HEAD
  return (
    isLoaded && (
      <div className={classes.gridContainer}>
        <Link to="/Projects" style={{ textDecoration: 'none' }}>
          <Tooltip
            title="Create and manage projects, update their status, and handle groups' requests."
            arrow
            placement="top"
            classes={{ tooltip: classes.customTooltip, arrow: classes.customTooltipArrow }}
          >
            <Card className={`${classes.cardStyle} ${classes.dashboardCard}`}>
              <CardContent className={classes.contentStyle}>
                <DesignServicesSharpIcon className={classes.iconStyle} />
                <Typography className={classes.badgeStyle}>
                  {t('header.navbar.projects')}
                </Typography>
                <Typography className={classes.numberStyle}>{projectsCount}</Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Link>

        <Link to="/GroupView" style={{ textDecoration: 'none' }}>
          <Tooltip
            title="Import, add, or remove groups, manage members, and assign projects."
            arrow
            placement="top"
            classes={{ tooltip: classes.customTooltip, arrow: classes.customTooltipArrow }}
          >
            <Card className={`${classes.cardStyle} ${classes.dashboardCard}`}>
              <CardContent className={classes.contentStyle}>
                <GroupsSharpIcon className={classes.iconStyle} />
                <Typography className={classes.badgeStyle}>
                  {t('header.navbar.groups')}
                </Typography>
                <Typography className={classes.numberStyle}>{groupsCount}</Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Link>

        <Link to="/Students" style={{ textDecoration: 'none' }}>
          <Tooltip
            title="Import, edit, and view all students, their profiles, and their group number."
            arrow
             placement="bottom"
            classes={{ tooltip: classes.customTooltip, arrow: classes.customTooltipArrow }}
          >
            <Card className={`${classes.cardStyle} ${classes.dashboardCard}`}>
              <CardContent className={classes.contentStyle}>
                <PersonIcon className={classes.iconStyle} />
                <Typography className={classes.badgeStyle}>
                  {t('header.navbar.students')}
                </Typography>
                <Typography className={classes.numberStyle}>{studentsCount}</Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Link>

        <Link to="/Sections" style={{ textDecoration: 'none' }}>
          <Tooltip
            title="Create, manage, and view all course-related sections."
            arrow
            placement="bottom"
            classes={{ tooltip: classes.customTooltip, arrow: classes.customTooltipArrow }}
          >
            <Card className={`${classes.cardStyle} ${classes.dashboardCard}`}>
              <CardContent className={classes.contentStyle}>
                <ClassIcon className={classes.iconStyle} />
                <Typography className={classes.badgeStyle}>
                  {t('header.navbar.sections')}
                </Typography>
                <Typography className={classes.numberStyle}>{sectionsCount}</Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Link>
      </div>
    )
  )
}

export default ProfessorHomePage
=======
  const cardStyle = {
    height: '200px', // Set the desired height
    borderRadius: '10px', // Add rounded edges
    transition: 'box-shadow 0.3s', // Add transition for smooth hover effect
    '&:hover': {
      boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)', // Add box shadow on hover
      transform: 'scale(1.05)' // Scale up on hover
    },
    cursor: 'pointer' // Add pointer cursor for better UX
  }

  const titleStyle = {
    textAlign: 'left' // Align the text to the center
  }

  const iconStyle = {
    fontSize: '120px', // Set the icon size to 120
    marginBottom: '1rem' // Add spacing between the icon and badge
  }

  const contentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  }

  const badgeStyle = {
    width: '5rem',
    height: '5rem',
    borderRadius: '50%',
    border: '3px solid #575757', // Add border and set the color
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto',
    marginBottom: '0.5rem' // Add spacing between the badge and text
  }

  const badgeTextStyle = {
    fontWeight: 'bold'
  }

  return (
    <Container style={{ marginBottom: '20px', marginTop: '20px' }}>
      <Box
        sx={{
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex'
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
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4em'
                      }}
                    >
                      <div style={{ float: 'left' }}>
                        <DesignServicesSharpIcon style={iconStyle} />
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column'
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
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4em'
                      }}
                    >
                      <div style={{ float: 'left' }}>
                        <GroupsSharpIcon style={iconStyle} />
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column'
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
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4em'
                      }}
                    >
                      <div style={{ float: 'left' }}>
                        <PersonIcon style={iconStyle} />
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column'
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
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4em'
                      }}
                    >
                      <div style={{ float: 'left' }}>
                        <ClassIcon style={iconStyle} />
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column'
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
      <Footer/>
    </Container>
  )
}

export default HomePage
>>>>>>> a4e2fed (fixed merge errors)
