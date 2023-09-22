import { useState, useEffect } from "react";
import { Box, Grid, Card, CardContent, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Stack, Container, Alert, Snackbar
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { getUserEmail } from "../../utils/UserEmail";
import AddProjectModal from "./AddProjectModal";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '32px',
    marginBottom: '32px',
  },
  root: {
    margin: "1rem",
    minWidth: 350,
  },
  button: {
    marginTop: "1rem",
  },
  addButton: {
    marginTop: "3rem",
  },
  container: {
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  bold: {
    fontWeight: "bold",
  },
  status: {
    borderRadius: "0.25rem",
    color: "#fff",
    maxWidth: "9ch",
    padding: "0.25rem",
  },
  new: {
    backgroundColor: "#4caf50",
  },
  interested: {
    backgroundColor: "#ff9800",
  },
  needed: {
    backgroundColor: "#2196f3",
  },
  approval: {
    backgroundColor: "#3f51b5",
  },
  assigned: {
    backgroundColor: "#f44336",
  },
  proposed: {
    backgroundColor: "#ef6694",
  },
  info: {
    backgroundColor: "#2196f3",
  },
  modal: {
    position: "absolute",
    width: "600px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    borderRadius: "0.5rem",
    boxShadow: 24,
    p: 4,
  },
  textField: {
    "& .MuiInputLabel-root": {
      color: "#6b6b6b",
      fontWeight: "bold",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#c8c8c8",
      },
      "&:hover fieldset": {
        borderColor: "#afafaf",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#2196f3",
      },
    },
  },
}));

function StudentProjects() {

  const classes = useStyles();
  const [projects, setProjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setErrorShowAlert] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [currentGroup, setCurrGroup] = useState(null)

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchData = () => {
    Promise.all(
      [
        getUserEmail(),
        fetch("/api/projects"),
        fetch("/api/students")
      ])
      .then(([resEmail, resProjects, resStudents]) =>
        Promise.all([resEmail, resProjects.json(), resStudents.json()])
      ).then(([Email, projects, students]) => {
        
        // Filter projects
        if (projects.length > 0 && projects.message !== "Project list is empty."){
          projects = projects.filter(project => project.status !== "assigned")
          setProjects(projects)
        }
        if(students.length > 0 && students.message !== "Student list is empty."){
          setStudents(students)
          let currStudent = students.filter(student => student.email === Email)
          setCurrGroup(currStudent[0].group)
        }
        setIsLoading(false)
      });
  };

  const fetchProjects = () => {
    fetch("/api/projects")
      .then((response) => response.json())
      .then((data) => {
        // check if we recieve a list of project or not
        setProjects(data)
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    setIsLoading(true)
    fetchData()
  }, []);

  const handleProjectApplication = (event, project) => {
    event.preventDefault();

    let body = {
      "project_name": project.project,
      "project_id": project._id,
      "group_id": currentGroup
    }

    fetch("api/request/join/project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('There is no Students');
        }
      })
      .then((data) => {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      })
      .catch((error) => {
        setErrorShowAlert(true);
        setTimeout(() => setErrorShowAlert(false), 3000);
        console.error(error);
      });
  };

  return (
    <Container>
      <Snackbar open={showErrorAlert} onClose={() => setErrorShowAlert(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="error">
          Project Application Already Sent
        </Alert>
      </Snackbar>
      <Snackbar open={showAlert} onClose={() => setShowAlert(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="success">
          Project Request Sent
        </Alert>
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
            <Grid container md={9} sm={12} xs={12}>
              <TextField
                id="search"
                label="Search by project name"
                variant="outlined"
                size="small"
                value={searchTerm}
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
              <AddProjectModal
                open={open}
                onClose={handleClose}
                fetchProjects={fetchProjects}
                currentGroup={currentGroup}
              />
            </Grid>
            {Array.isArray(projects) && projects.length !== 0 ? projects.map((project) => (
              <form className={classes.formContainer} onSubmit={(event) => handleProjectApplication(event, project)}>
                <Grid key={project.id}>
                  <Card className={classes.root} style={{ padding: "1rem" }}>
                    <CardContent>
                      <Typography
                        variant="h5"
                        component="h2"
                        className={classes.bold}
                      >
                        {project.project}
                      </Typography>
                      <Typography
                        variant="body2"
                        component="p"
                        style={{ marginTop: "1rem" }}
                      >
                        {project.description}
                      </Typography>
                      <Typography
                        variant="body2"
                        component="p"
                        style={{ marginTop: "1rem" }}
                      >
                        <span className={classes.bold}>Client Name:</span>{" "}
                        {project.clientName}
                      </Typography>
                      <Typography
                        variant="body2"
                        component="p"
                      >
                        <span className={classes.bold}>Client Email:</span>{" "}
                        {project.clientEmail}
                      </Typography>
                      <Typography variant="body2" component="p">
                        <span className={classes.bold}>Status:</span>{" "}
                        <Box
                          component="span"
                          className={`${classes.status} ${project.status === "new"
                            ? classes.new
                            : project.status === "interested students"
                              ? classes.interested
                              : project.status === "students needed"
                                ? classes.needed
                                : project.status === "pending approval"
                                  ? classes.approval
                                  : project.status === "assigned"
                                    ? classes.assigned
                                    : project.status === "proposed"
                                      ? classes.proposed
                                      : classes.info
                            }`}
                        >
                          {project.status}
                        </Box>
                      </Typography>
                      <Typography variant="body2" component="p">
                        <span className={classes.bold}>Group:</span>{" "}
                        {project.group}
                      </Typography>
                      <Button
                        variant="text"
                        color="primary"
                        type="sumbit"
                        disabled={
                          project.status === "pending approval" ||
                          project.status === "assigned" ||
                          project.status === "proposed" ||
                          currentGroup === null
                        }
                        className={classes.button}
                        style={{ marginTop: "1rem" }}
                      >
                        REQUEST
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </form>
            )) : null}
          </Grid>
        </Box>
      {/* )} */}
    </Container>
  );
}

export default StudentProjects;
