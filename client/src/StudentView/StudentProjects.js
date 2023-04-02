import { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, TextField, Modal, Dialog, DialogTitle, DialogContent, DialogActions, Stack } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    margin: '1rem',
    minWidth: 250,
  },
  button: {
    marginTop: '1rem',
  },
  addButton: {
    marginTop: '3rem',
  },
  container: {
    // display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // margin: '2rem',
  },
  title: {
    fontWeight: 'bold',
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  bold: {
    fontWeight: 'bold',
  },
  status: {
    borderRadius: '0.25rem',
    color: '#fff',
    maxWidth: '9ch',
    padding: '0.25rem',
  },
  new: {
    backgroundColor: '#4caf50',
  },
  interested: {
    backgroundColor: '#ff9800',
  },
  needed: {
    backgroundColor: '#2196f3',
  },
  approval: {
    backgroundColor: '#3f51b5',
  },
  assigned: {
    backgroundColor: '#f44336',
  },
  proposed: {
    backgroundColor: '#ef6694',
  },
  info: {
    backgroundColor: '#2196f3',
  },
  modal: {
    position: 'absolute',
    width: '600px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    borderRadius: '0.5rem',
    boxShadow: 24,
    p: 4,
  },
  textField: {
    '& .MuiInputLabel-root': {
      color: '#6b6b6b',
      fontWeight: 'bold',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#c8c8c8',
      },
      '&:hover fieldset': {
        borderColor: '#afafaf',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#2196f3',
      },
    },
  },
});

const mockProjects = [
  {
    id: 1,
    name: 'Project A',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    client: 'Client A',
    status: 'interested students',
    group: 'Group 1',
  },
  {
    id: 2,
    name: 'Project B',
    description: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
    client: 'Client B',
    status: 'assigned',
    group: 'Group 2',
  },
  {
    id: 3,
    name: 'Project C',
    description: 'Aliquam faucibus, mauris quis vulputate fermentum, magna dui hendrerit urna, ac varius ipsum ex in turpis. Sed faucibus, sapien sit amet tincidunt lobortis, elit ipsum sagittis ex, vel bibendum tellus neque id tellus. Sed faucibus, sapien sit amet tincidunt lobortis, elit ipsum sagittis ex, vel bibendum tellus neque id tellus. Sed faucibus, sapien sit amet tincidunt lobortis, elit ipsum sagittis ex, vel bibendum tellus neque id tellus.',
    client: 'Client C',
    status: 'pending approval',
    group: 'Group 1',
  },
  {
    id: 4,
    name: 'Project D',
    description: 'Vestibulum rutrum purus a nisi facilisis posuere.',
    client: 'Client D',
    status: 'proposed',
    group: 'Group 2',
  },
  {
    id: 5,
    name: 'Project E',
    description: 'Sed faucibus, sapien sit amet tincidunt lobortis, elit ipsum sagittis ex, vel bibendum tellus neque id tellus.',
    client: 'Client E',
    status: 'students needed',
    group: 'Group 1',
  },
  {
    id: 6,
    name: 'Project F',
    description: 'Fusce congue, nulla in finibus varius, felis enim pulvinar tellus, quis bibendum purus tortor quis odio.',
    client: 'Client F',
    status: 'new',
    group: 'Group 2',
  },
];

function StudentProjects() {
  const classes = useStyles();

  const [projects, setProjects] = useState(mockProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const filteredProjects = projects.filter((project) => {
    if (project.project !== undefined)
      return project.project.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const fetchProjects = () => {
    fetch("/api/projects")
      .then(response => response.json())
      .then(data => {
        setProjects(data);
      })
      .catch(error => {
        console.error(error);
      });
  };

 

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = (newProject) => {
    setProjects([...projects, { ...newProject, id: projects.length + 1 }]);
  };
  
  return (
    <div className={classes.container}>
    <Box alignItems="center" justifyContent="center">
      <Grid container spacing={1} justifyContent="center" alignItems="center" style={{ marginLeft: '0.5rem' }}>
        <Grid container md={9} sm={12} xs={12}>
          <TextField
              id="search"
              label="Search by project name"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearch}
              style={{ marginTop: '3rem', width: '30%'}}
            />
        </Grid>
        <Grid container md={9} sm={12} xs={12}>
        <Button variant="contained" color = "primary" onClick={handleOpen} style={{ marginTop: '0.5rem' }}>
                Add Project
            </Button>
            <AddProjectModal open={open} onClose={handleClose} onSubmit={handleSubmit} />
        </Grid>
        {filteredProjects.map((project) => (
          <Grid item md={9} sm={12} xs={12} key={project.id}>
            <Card className={classes.root} style={{ padding: '1rem' }}>
              <CardContent>
                <Typography variant="h5" component="h2" className={classes.bold}>
                  {project.name}
                </Typography>
                <Typography variant="body2" component="p" style={{ marginTop: '1rem' }}>
                  {project.description}
                </Typography>
                <Typography variant="body2" component="p" style={{ marginTop: '1rem' }}>
                  <span className={classes.bold}>Client:</span> {project.client}
                </Typography>
                <Typography variant="body2" component="p">
                  <span className={classes.bold}>Status:</span>{' '}
                  <Box
                    component="span"
                    className={`${classes.status} ${
                      project.status === 'new'
                        ? classes.new
                        : project.status === 'interested students'
                        ? classes.interested
                        : project.status === 'students needed'
                        ? classes.needed
                        : project.status === 'pending approval'
                        ? classes.approval
                        : project.status === 'assigned'
                        ? classes.assigned
                        : project.status === 'proposed'
                        ? classes.proposed
                        : classes.info
                    }`}
                  >
                    {project.status}
                  </Box>
                </Typography>
                <Typography variant="body2" component="p">
                  <span className={classes.bold}>Group:</span> {project.group}
                </Typography>
                <Button
                  variant="text"
                  color="primary"
                  disabled={
                    project.status === 'pending approval' ||
                    project.status === 'assigned' ||
                    project.status === 'proposed'
                  }
                  className={classes.button}
                  style={{ marginTop: '1rem' }}
                >
                  Join
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  </div>

  );
}

// Modal to add a project
function AddProjectModal({ open, onClose, onSubmit }) {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [client, setClient] = useState('');
  const [group, setGroup] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const newProject = { name, description, client, group };
    onSubmit(newProject);
    setName('');
    setDescription('');
    setClient('');
    
    setGroup('');
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem', textAlign: 'center' }}>Add Project</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >
            <TextField
              fullWidth
              required
              label="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              variant="outlined"
              className={classes.textField}
            />
            <TextField
              fullWidth
              required
              label="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              variant="outlined"
              className={classes.textField}
              multiline
              rows={4}
            />
            <TextField
              fullWidth
              required
              label="Client"
              value={client}
              onChange={(event) => setClient(event.target.value)}
              variant="outlined"
              className={classes.textField}
            />
            <TextField
              fullWidth
              required
              label="Group"
              value={group}
              onChange={(event) => setGroup(event.target.value)}
              variant="outlined"
              className={classes.textField}
            />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Add Project
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default StudentProjects;
  