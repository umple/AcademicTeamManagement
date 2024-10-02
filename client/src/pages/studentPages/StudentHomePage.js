// Imports
import React, { useState, useEffect } from 'react'
import { getUserName } from '../../helpers/UserName'
import { getUserEmail } from '../../helpers/UserEmail'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Footer from '../../components/common/Footer'
import groupService from '../../services/groupService'
import {
  makeStyles,
  Grid,
  Typography,
  Paper,
  Button
} from '@material-ui/core'
import studentService from '../../services/studentService'

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(4),
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: '4rem',
    fontWeight: 700
  },
  column1: {
    paddingLeft: 50
  },
  welcomeText: {
    fontSize: '2rem',
    fontWeight: 500,
    color: '#616161'
  },
  noGroupMessage: {
    fontSize: '1.2rem',
    marginTop: theme.spacing(2),
    color: '#ff1744'
  },
  infoBox: {
    padding: theme.spacing(3),
    borderRadius: '30px',
    backgroundColor: '#a4a0a5',
    marginBottom: theme.spacing(2),
    textAlign: 'left',
    width: '90%'
  },
  infoTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#ffffff'
  },
  infoSubtitle: {
    fontSize: '1rem',
    fontWeight: 400,
    color: '#ffffff',
    marginBottom: theme.spacing(2)
  },
  infoButton: {
    marginTop: theme.spacing(2),
    backgroundColor: '#2e3f51',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#1565c0'
    }
  },
  groupButton: {
    marginTop: theme.spacing(2)
  }
}))

// StudentHomePage Component
function StudentHomePage () {
  const { t } = useTranslation()
  const classes = useStyles()
  const [userName, setUserName] = useState('')
  const [studentEmail, setStudentEmail] = useState(null)
  const [setGroupInfo] = useState(null) // state for group info
  const [setStudents] = useState([])

  // Retrieve the username
  useEffect(() => {
    getUserName()
      .then((name) => {
        setUserName(name)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [setUserName])

  // Cache the value of the students's email
  useEffect(() => {
    getUserEmail()
      .then((email) => {
        setStudentEmail(email)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [studentEmail])

  // Get student names
  useEffect(() => {
    studentService.get()
      .then((data) => {
        if (data.students) {
          console.log('Student Data:', data.students)
          setStudents(data.students)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  // Get student's group info
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const groupData = await groupService.getCurrGroup()
        console.log('Group Info:', groupData)
        setGroupInfo(groupData)
      } catch (error) {
        console.error('Error getting group info:', error)
      }
    }
    fetchGroup()
  }, [])

  return (
    <div className={classes.root}>
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        <Grid item sm={6} className={classes.column1}>
          <Typography variant="h3" className={classes.title} gutterBottom>
            {t('common.academic-team-management')}
          </Typography>
          <Typography variant="h2" className={classes.welcomeText} gutterBottom>
            {t('home.welcome')} {userName}!
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={4} justifyContent="center" alignItems="center">
        {/* Group Info Section */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} className={classes.infoBox}>
            <Typography variant="h5" className={classes.infoTitle}>
              {t('GROUP INFO')}
            </Typography>
            <Typography variant="body1" className={classes.infoSubtitle}>
              {t("Looks like you're not in a group yet")}
            </Typography>
            <Button
              component={Link}
              to="/studentGroups"
              variant="contained"
              className={classes.infoButton}
            >
              {t('Join a group or create a group')}
            </Button>
          </Paper>
        </Grid>

        {/* Project Info Section */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} className={classes.infoBox}>
            <Typography variant="h5" className={classes.infoTitle}>
              {t('PROJECT INFO')}
            </Typography>
            <Typography variant="body1" className={classes.infoSubtitle}>
              {t('You must be in a group before you have a project')}
            </Typography>
            <Button
              component={Link}
              to="/StudentProjects"
              variant="contained"
              className={classes.infoButton}
            >
              {t('Browse projects')}
            </Button>
          </Paper>
        </Grid>
      </Grid>
      <Footer/>
    </div>
  )
}

export default StudentHomePage
