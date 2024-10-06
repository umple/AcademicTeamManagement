// Imports
import React, { useState, useEffect } from 'react'
import { getUserName } from '../../helpers/UserName'
import { getUserEmail } from '../../helpers/UserEmail'
import { useTranslation } from 'react-i18next'
import Footer from '../../components/common/Footer'
import groupService from '../../services/groupService'
import {
  makeStyles,
  Grid,
  Chip,
  Paper,
  Button,
  Typography
} from '@material-ui/core'
import { useNavigate } from 'react-router-dom'
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
  infoBox: {
    padding: theme.spacing(3),
    borderRadius: '30px',
    backgroundColor: '#a4a0a5',
    marginBottom: theme.spacing(2),
    textAlign: 'left',
    transition: 'background-color 0.3s ease-in-out'
  },
  infoBoxInGroup: {
    backgroundColor: '#800020',
    color: '#fff'
  },
  button: {
    marginTop: theme.spacing(2)
  }
}))

// StudentHomePage Component
function StudentHomePage () {
  const { t } = useTranslation()
  const classes = useStyles()
  const navigate = useNavigate()
  const [userName, setUserName] = useState('')
  const [studentEmail, setStudentEmail] = useState(null)
  const [groupInfo, setGroupInfo] = useState(null) // state for group info
  const [students, setStudents] = useState([])

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

  // Function to get student name by ID
  const getStudentNameById = (id) => {
    const student = students.find((student) => student.orgdefinedid === id)
    return student ? student.firstname + ' ' + student.lastname : 'Unknown'
  }

  // Determine if the student is in a group or has a project
  const isInGroup = groupInfo && groupInfo.group_id
  const hasProject = groupInfo && groupInfo.project

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

      {/* Group Info Section */}
      <Paper
        elevation={3}
        className={`${classes.infoBox} ${isInGroup ? classes.infoBoxInGroup : ''}`}
        onClick={isInGroup ? () => navigate('/MyGroup') : null}
        style={{ cursor: isInGroup ? 'pointer' : 'default' }}
      >
        <Typography variant="h5">
          {t('common.group-info')}
        </Typography>
        {isInGroup
          ? (
          <>
            <Typography variant="body1">
              <strong>{t('Group Name')}:</strong> {groupInfo.group_id}
            </Typography>
            <Typography variant="h6">{t('common.Members')}:</Typography>
            {groupInfo.members && groupInfo.members.length > 0
              ? groupInfo.members.map((memberID, index) => (
                  <Chip key={index} label={getStudentNameById(memberID)} color="primary" style={{ margin: 5 }} />
              ))
              : <Typography variant="body2">{t('common.no-members')}</Typography>}
          </>
            )
          : (
          <>
            <Typography variant="body1">
              {t('common.not-in-group')}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => navigate('/StudentGroups')}
            >
              {t('common.find-or-create-group')}
            </Button>
          </>
            )}
      </Paper>

      {/* Project Info Section */}
      <Paper
        elevation={3}
        className={`${classes.infoBox} ${hasProject ? classes.infoBoxInGroup : ''}`}
        onClick={hasProject ? () => navigate('/MyGroup') : null}
        style={{ cursor: hasProject ? 'pointer' : 'default' }}
      >
        <Typography variant="h5">
          {t('Project Info')}
        </Typography>
        {hasProject
          ? (
          <Typography variant="body1">
            <strong>{t('common.project-name')}:</strong> {groupInfo.project}
          </Typography>
            )
          : (
          <>
            <Typography variant="body1">
              {isInGroup
                ? t('common.no-project-assigned')
                : t('common.group-before-project')
              }
            </Typography>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => navigate('/StudentProjects')}
            >
              {t('Browse projects')}
            </Button>
          </>
            )}
      </Paper>

    <Footer/>
    </div>
  )
}

export default StudentHomePage
