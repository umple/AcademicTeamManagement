import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  Container,
  Alert,
  Snackbar,
  Tooltip
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import InfoIcon from '@mui/icons-material/Info'
import { getUserEmail } from '../../helpers/UserEmail'
import AddProjectModal from './forms/AddProjectModal'
import projectService from '../../services/projectService'
import studentService from '../../services/studentService'
import ProjectCard from './ProjectCard'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import { useTranslation } from 'react-i18next'

function StudentProjects () {
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [open, setOpen] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [showErrorAlert, setErrorShowAlert] = useState(false)
  const [group, setCurrGroup] = useState(null)
  const [currentStudent, setCurrentStudent] = useState({})
  const { t } = useTranslation()

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase().trim()
    if (searchTerm === '') {
      setFilteredProjects(projects)
    } else {
      const filteredProjects = projects.filter((project) =>
        project.project.toLowerCase().includes(searchTerm)
      )
      setFilteredProjects(filteredProjects)
    }
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const fetchProjects = async () => {
    try {
      const projectsData = await projectService.get()
      if (projectsData.count > 0) {
        const projectsFiltered = projectsData.projects.filter(
          (project) =>
            project.status !== 'Completed' || project.status !== 'Cancelled'
        )
        setProjects(projectsData.projects)
        setFilteredProjects(projectsFiltered)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchStudents = async () => {
    try {
      const studentsData = await studentService.get()
      const Email = await getUserEmail()
      if (studentsData.count && studentsData.count > 0) {
        const currStudent = studentsData.students.filter(
          (student) => student.email === Email
        )
        setCurrentStudent(currStudent[0])
        setCurrGroup(currStudent[0].group)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchProjects()
    fetchStudents()
  }, [open])

  return (
    <Container>
      <Snackbar
        open={showErrorAlert}
        onClose={() => setErrorShowAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error">{t('project.request-already-sent')}</Alert>
      </Snackbar>
      <Snackbar
        open={showAlert}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success">{t('project.request-sent')}</Alert>
      </Snackbar>

      <Box>
        <Typography variant="h2" align="center" fontWeight="fontWeight" sx={{ marginBottom: '1rem', marginTop: '9rem' }}>
          {t('project.student-projects')}
        </Typography>
      </Box>
      <Box mt={5}>
        <Grid
          container
          spacing={1}
          justifyContent="center"
          alignItems="center"
          style={{ display: 'block' }}
          >
          <Grid
            item container
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: 1,
              px: 3
            }}
            >
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpen}
                disabled={!group}
                style={{ marginLeft: '1rem' }}
                startIcon={<AddIcon />}
              >
                {t('project.student-add-project')}
              </Button>
              <Tooltip
                title={t('project.make-sure-join-group')}
                arrow
              >
                <IconButton>
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <TextField
              id="search"
              label={t('project.search-by-project')}
              variant="outlined"
              size='small'
              style={{ width: '50%' }}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <SearchIcon
                    sx={{
                      color: 'action.active',
                      mr: 1,
                      pointerEvents: 'none'
                    }}
                  />
                )
              }}
            />
          </Grid>

          {group && currentStudent && (
            <AddProjectModal
              open={open}
              projects={projects}
              onClose={handleClose}
              professorEmail={currentStudent.professorEmail}
              group={group}
            />
          )}
          {Array.isArray(projects) && projects.length !== 0
            ? filteredProjects.map((project, key) => (
                <ProjectCard
                  key={key}
                  project={project}
                  setShowAlert={setShowAlert}
                  group={group}
                  setErrorShowAlert={setErrorShowAlert}
                ></ProjectCard>
            ))
            : null}
        </Grid>
      </Box>
    </Container>
  )
}

export default StudentProjects
