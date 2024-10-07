import React, { useState, useEffect } from 'react'
import ResponsiveAppBar from '../../components/StaticComponents/NavBar/ResponsiveAppBar'
import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@mui/material/Card'
import { CardContent } from '@mui/material'
import GroupsSharpIcon from '@mui/icons-material/GroupsSharp'
import ClassIcon from '@mui/icons-material/Class'
import Tooltip from '@mui/material/Tooltip'
import PersonIcon from '@mui/icons-material/Person'
import DesignServicesSharpIcon from '@mui/icons-material/DesignServicesSharp'
import projectService from '../../services/projectService'
import groupService from '../../services/groupService'
import studentService from '../../services/studentService'
import sectionService from '../../services/sectionService'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

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
    </div>
  )
}

const DashBoardInfo = () => {
  const classes = useStyles()
  const [studentsCount, setStudentCount] = useState(0)
  const [groupsCount, setGroupCount] = useState(0)
  const [projectsCount, setProjectCount] = useState(0)
  const [sectionsCount, setSectionsCount] = useState(0)
  const { t } = useTranslation()
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
    sectionService.get().then((data) => {
      data.count && setSectionsCount(data.count ?? 0)
    })
  }, [])

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
