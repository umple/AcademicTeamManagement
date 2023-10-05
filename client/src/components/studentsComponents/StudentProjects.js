import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  Container,
  Alert,
  Snackbar,
} from "@mui/material";
import { getUserEmail } from "../../helpers/UserEmail";
import AddProjectModal from "./forms/AddProjectModal";
import projectService from "../../services/projectService";
import studentService from "../../services/studentService";
import ProjectCard from "./ProjectCard";

function StudentProjects() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setErrorShowAlert] = useState(false);
  const [currentGroup, setCurrGroup] = useState(null);
  const [currentStudent, setCurrentStudent] = useState({});

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase().trim();
    if (searchTerm === "") {
      setFilteredProjects(projects);
    } else {
      const filteredProjects = projects.filter((project) =>
        project.project.toLowerCase().includes(searchTerm)
      );
      setFilteredProjects(filteredProjects);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchProjects = async () => {
    try {
      let projects = await projectService.get();
      if (
        projects.length > 0 &&
        projects.message !== "Project list is empty."
      ) {
        projects = projects.filter((project) => project.status !== "assigned");
        setProjects(projects);
        setFilteredProjects(projects);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStudents = async () => {
    try {
      let students = await studentService.get();
      let Email = await getUserEmail();
      if (
        students.length > 0 &&
        students.message !== "Student list is empty."
      ) {
        let currStudent = students.filter((student) => student.email === Email);
        setCurrentStudent(currStudent[0]);
        setCurrGroup(currStudent[0].group);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchStudents();
  }, []);

  return (
    <Container>
      <Snackbar
        open={showErrorAlert}
        onClose={() => setErrorShowAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error">Project Application Already Sent</Alert>
      </Snackbar>
      <Snackbar
        open={showAlert}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success">Project Request Sent</Alert>
      </Snackbar>
      <Typography variant="h2" align="center" fontWeight="fontWeightBold">
        Student Projects
      </Typography>
      <Box>
        <Grid
          container
          spacing={1}
          justifyContent="center"
          alignItems="center"
          style={{ display: "block" }}
        >
          <Grid item container md={9} sm={12} xs={12}>
            <TextField
              id="search"
              label="Search by project name"
              variant="outlined"
              size="small"
              onChange={handleSearch}
              style={{ marginTop: "3rem", width: "30%" }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpen}
              style={{ marginTop: "3rem", width: "30%", marginLeft: "1rem" }}
            >
              Add Project
            </Button>
            {currentGroup && currentStudent && (
              <AddProjectModal
                open={open}
                onClose={handleClose}
                professorEmail={currentStudent.professorEmail}
                currentGroup={currentGroup}
              />
            )}
          </Grid>
          {Array.isArray(projects) && projects.length !== 0
            ? filteredProjects.map((project, key) => (
                <ProjectCard
                  key={key}
                  project={project}
                  setShowAlert={setShowAlert}
                  currentGroup={currentGroup}
                  setErrorShowAlert={setErrorShowAlert}
                ></ProjectCard>
              ))
            : null}
        </Grid>
      </Box>
    </Container>
  );
}

export default StudentProjects;
