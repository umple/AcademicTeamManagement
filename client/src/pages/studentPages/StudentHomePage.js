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
  Box,
  Chip,
  Typography,
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

      <Box className={classes.groupInfo}>
        {
          groupInfo
            ? (
            <>
              <Typography variant="h5">{t('Group Info')}</Typography>
              <Typography variant="body1">
                <strong>{t('Group Name')}:</strong> {groupInfo.group_id}
              </Typography>
              <Typography variant="body1">
                <strong>{t('common.Project')}:</strong> {groupInfo.project || 'No project assigned'}
              </Typography>

              <Typography variant="h6">{t('common.Members')}:</Typography>
              {groupInfo.members && groupInfo.members.length > 0
                ? (
                    groupInfo.members.map((memberID, index) => (
                  <Chip key={index} label={getStudentNameById(memberID)} color="primary" style={{ margin: 5 }} />
                    ))
                  )
                : (
                <Typography variant="body2">{t('common.no-members')}</Typography>
                  )}
            </>
              )
            : (
            <>
              <Typography variant="h6" className={classes.noGroupMessage}>
                {t("Looks like you haven't found a group yet.")}
              </Typography>
              <Button
                component={Link}
                to="/studentGroups"
                variant="contained"
                color="primary"
                className={classes.groupButton}
              >
                {t('Find or Create a Group')}
              </Button>
            </>
              )
        }
      </Box>

      <Footer/>
    </div>
  )
}

export default StudentHomePage
