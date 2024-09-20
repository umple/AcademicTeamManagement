import React, { useState, useEffect } from 'react'
import ResponsiveAppBar from '../../components/StaticComponents/NavBar/ResponsiveAppBar'
import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@mui/material/Card'
import { CardContent } from '@mui/material'
import GroupsSharpIcon from '@mui/icons-material/GroupsSharp'
import ClassIcon from '@mui/icons-material/Class'
import PersonIcon from '@mui/icons-material/Person'
import DesignServicesSharpIcon from '@mui/icons-material/DesignServicesSharp'
import projectService from '../../services/projectService'
import groupService from '../../services/groupService'
import studentService from '../../services/studentService'
import sectionService from '../../services/sectionService'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
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
    alignItems: 'flex-start', // Align left like in the second screenshot
    color: '#fff',
    padding: theme.spacing(4),
    paddingLeft: '80px' // Add some padding on the left for better alignment
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
    fontSize: '5rem', // Increased title size for greater prominence
    fontWeight: 700,
    textAlign: 'left',
    lineHeight: '1.2' // Adjust line height for better compactness
  },
  cardStyle: {
    height: '220px', // Card size
    width: '220px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    transition: 'box-shadow 0.3s',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    border: '1px solid #e0e0e0', // Add subtle border
    '&:hover': {
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      transform: 'scale(1.05)'
    }
  },
  iconStyle: {
    fontSize: '90px', // Slightly reduce the icon size to fit better with the text
    color: '#000' // Black icons for white background
  },
  badgeStyle: {
    fontWeight: 'bold',
    marginTop: theme.spacing(1),
    fontSize: '1.5rem', // Adjust label size
    color: '#8f001a' // Use the theme color for labels
  },
  numberStyle: {
    color: '#8f001a',
    fontWeight: 'bold',
    fontSize: '2.5rem', // Large font for numbers
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
    gridTemplateColumns: 'repeat(2, 1fr)', // Align cards in two columns
    gap: theme.spacing(3) // Add consistent spacing between cards
  }
}))

const AdminHomePage = () => {
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <div>
      {/* Navbar */}
      <ResponsiveAppBar />  {/* Include the navbar at the top */}

      {/* Main Content */}
      <div className={classes.root}>
        <Grid container style={{ height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
          {/* Left Section (Title) */}
          <Grid item xs={12} sm={6} className={classes.leftSection}>
            <Typography variant="h2" className={classes.title}>
              {t('common.academic-team-management')}
            </Typography>
          </Grid>

          {/* Right Section (Dashboard Icons) */}
          <Grid item xs={12} sm={6} className={classes.rightSection}>
            <DashBoardInfo />
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

const DashBoardInfo = () => {
  const [studentsCount, setStudentCount] = useState(113)
  const [groupsCount, setGroupCount] = useState(4)
  const [projectsCount, setProjectCount] = useState(5)
  const [sectionsCount, setSectionsCount] = useState(2)
  const { t } = useTranslation()
  const classes = useStyles()

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
    sectionService.get().then((data) => {
      data.count && setSectionsCount(data.count ?? 0)
    })
  }, [])

  return (
    <div className={classes.gridContainer}>
      {/* Projects Card */}
      <Link to="/AdminProjects" style={{ textDecoration: 'none' }}>
        <Card className={classes.cardStyle}>
          <CardContent className={classes.contentStyle}>
            <DesignServicesSharpIcon className={classes.iconStyle} />
            <Typography className={classes.badgeStyle}>
              {t('header.navbar.projects')}
            </Typography>
            <Typography className={classes.numberStyle}>
              {projectsCount}
            </Typography>
          </CardContent>
        </Card>
      </Link>

      {/* Groups Card */}
      <Link to="/AdminGroupView" style={{ textDecoration: 'none' }}>
        <Card className={classes.cardStyle}>
          <CardContent className={classes.contentStyle}>
            <GroupsSharpIcon className={classes.iconStyle} />
            <Typography className={classes.badgeStyle}>
              {t('header.navbar.groups')}
            </Typography>
            <Typography className={classes.numberStyle}>
              {groupsCount}
            </Typography>
          </CardContent>
        </Card>
      </Link>

      {/* Students Card */}
      <Link to="/AdminStudents" style={{ textDecoration: 'none' }}>
        <Card className={classes.cardStyle}>
          <CardContent className={classes.contentStyle}>
            <PersonIcon className={classes.iconStyle} />
            <Typography className={classes.badgeStyle}>
              {t('header.navbar.students')}
            </Typography>
            <Typography className={classes.numberStyle}>
              {studentsCount}
            </Typography>
          </CardContent>
        </Card>
      </Link>

      {/* Sections Card */}
      <Link to="/AdminSections" style={{ textDecoration: 'none' }}>
        <Card className={classes.cardStyle}>
          <CardContent className={classes.contentStyle}>
            <ClassIcon className={classes.iconStyle} />
            <Typography className={classes.badgeStyle}>
              {t('header.navbar.sections')}
            </Typography>
            <Typography className={classes.numberStyle}>
              {sectionsCount}
            </Typography>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}

export default AdminHomePage
