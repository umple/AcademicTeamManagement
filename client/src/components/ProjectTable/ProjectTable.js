import React, { useCallback, useState, useMemo, useEffect } from 'react';
import MaterialReactTable from 'material-react-table';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormLabel,
  FormGroup,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
  TextareaAutosize,
  Alert,
  Snackbar,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ExportToCsv } from 'export-to-csv';
import { Delete, Edit, Help } from '@mui/icons-material';
import Chip from '@mui/material/Chip';
import { colorStatus } from '../../helpers/statusColors';
import { csvOptions, handleExportData } from '../../helpers/exportData';
import { FilterDataByProfessor } from '../../helpers/FilterDataByValue';

const ProjectTable = () => {
  // Columns for table
  const columns = useMemo(
    () => [
      {
        accessorKey: 'project',
        header: 'Project',
      },
      {
        accessorKey: 'description',
        header: 'Description',
      },
      {
        accessorKey: 'clientName',
        header: "Client's Full Name",
      },

      {
        accessorKey: 'clientEmail',
        header: "Client's Email Address",
      },
      {
        accessorKey: 'status',
        header: 'Status',
        //custom conditional format and styling
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor:
                cell.getValue() === 'new'
                  ? theme.palette.success.light
                  : cell.getValue() === 'interested students'
                    ? theme.palette.warning.light
                    : cell.getValue() === 'students needed'
                      ? theme.palette.primary.light
                      : cell.getValue() === 'pending approval'
                        ? theme.palette.secondary.main
                        : cell.getValue() === 'assigned'
                          ? theme.palette.error.dark
                          : cell.getValue() === 'proposed'
                            ? '#ef6694'
                            : theme.palette.info.dark,
              borderRadius: '0.25rem',
              color: '#fff',
              maxWidth: '9ch',
              p: '0.25rem',
            })}
          >
            {cell.getValue()}
          </Box>
        ),
      },
      {
        accessorKey: 'group',
        header: 'Group',
      },
      {
        accessorKey: 'notes',
        header: 'Notes'
      },
    ],
    [],
  );

  // For the create profile modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRow,setEditingRow] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [applications, setApplications] = useState([]);
  const [editingValues, setEditingValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {}),
  );


  const fetchProjects = () => {
    fetch("/api/projects")
      .then(response => response.json())
      .then(data => {
        const professorEmail = JSON.parse(localStorage.getItem('userEmail')) // get the cached value of the professor's email
        const filteredProjectsTableData = FilterDataByProfessor(data, professorEmail) // keep only the data that contains the professor's email
        console.log("data here")
        setTableData(filteredProjectsTableData);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const fetchApplications = () => {
    fetch("api/project/applications").then(response => response.json())
      .then(data => {
        setApplications(data);
        setIsLoading(false)
      })
      .catch(error => {
        setApplications({})
        setTimeout(() => setIsLoading(false), 1000);
      });
  }

  useEffect(() => {
    setIsLoading(true)
    fetchProjects();
    fetchApplications();
  }, []);

  const [validationErrors, setValidationErrors] = useState({});

  const handleAddRow = useCallback(
    (newRowData) => {

      const professorEmail = JSON.parse(localStorage.getItem('userEmail')) // get the cached value of the professor's email
      const newProjectInfo = { ...newRowData, professorEmail: professorEmail } // add the professor's email as a new pair

      fetch('/api/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProjectInfo)
      })
        .then(response => {
          if (response.ok) {
            fetchProjects();
          }
        }).catch(error => {
          console.error(error);
        });
    },
    []
  );

  const handleSaveRowEdits = async (row, values) => {
    //if (!Object.keys(validationErrors).length) {
    const professorEmail = JSON.parse(localStorage.getItem('userEmail'))
    values["professorEmail"] = professorEmail
    console.log("POG")
      fetch(`api/project/update/${row.original._id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })
        .then(response => {
          console.log("GOT ")
          if (response.ok) {
            console.log("fetching")
            fetchProjects();
          } else {
            console.error("Error editing row");
          }
        })
        .catch(error => {
          console.error(error);
        });
    //}
  };

  const handleDeleteRow = useCallback((row) => {
    if (!window.confirm(`Are you sure you want to delete ${row.getValue('project')}?`)) {
      return;
    }

    fetch(`api/project/delete/${row.original._id}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          fetchProjects();
        } else {
          console.error('Error deleting row');
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  // For the model to view project applications
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const csvExporter = new ExportToCsv(csvOptions('ProjectsFromAcTeams-'));
 
  
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h2" align="center" fontWeight="fontWeightBold" sx={{ marginBottom: '0.5rem' }}>Projects</Typography>
      <Snackbar
        open={showAlert}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success">Feedback Sent!</Alert>
      </Snackbar>
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '5rem' }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <MaterialReactTable
            displayColumnDefOptions={{
              'mrt-row-actions': {
                muiTableHeadCellProps: {
                  align: 'center',
                },
                size: 120,
              },
            }}
            enablePagination={false}
            columns={columns}
            data={tableData}
            enableColumnOrdering
            enableColumnResizing
            columnResizeMode="onChange" //default is "onEnd"
            defaultColumn={{
              minSize: 100,
              size: 150, //default size is usually 180
            }}
            enableEditing
            initialState={{ showColumnFilters: false, density: 'compact' }}
            renderDetailPanel={({ row, index }) => {
              return (
                <Grid container spacing={2}>
                  <Grid item>
                    <TableContainer component={Paper}>
                      <Table sx={{}} size="small" aria-label="a dense table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Project Applications</TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableHead>
                          <TableRow>
                            <TableCell>Group</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          
                          
                          { applications.map((application) => {
                            if (row.original.project !== application.project){return}
                            return (
                              <TableRow key={row.id}>
                                <TableCell>
                                  {application.group_id}
                                </TableCell>
                                <TableCell align="right">
                                    <Chip 
              label = {application.status}
              color = {colorStatus(application.status)}
              />
                                  
                                </TableCell>
                                <TableCell align="right">
                                  <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleOpen}
                                  >
                                    View Application
                                  </Button>
                                  <ViewApplicationModal
                                    fetchApplications={fetchApplications}
                                    setShowAlert={setShowAlert}
                                    data={application}
                                    project={row.id}
                                    open={open}
                                    onClose={handleClose}
                                    onSubmit={() => setOpen(false)}
                                  />
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              );
            }}
            renderRowActions={({ row, table }) => (
              <Box sx={{ display: 'flex', gap: '1rem' }}>
                <Tooltip arrow placement="left" title="Edit">
                  <IconButton onClick={() => {
                    setEditingRow(row)
                    var temp = {}
                    {columns.map((column) => {
                      temp[column.accessorKey] = row.getValue(column.accessorKey)
                    })}
                    setEditingValues(temp)
                    setEditModalOpen(true)}
                  }>
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow placement="right" title="Delete">
                  <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
            renderTopToolbarCustomActions={() => (
              <Box sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}>
                <Button
                  color="success"
                  onClick={() => setCreateModalOpen(true)}
                  variant="contained"
                >
                  Create New Project
                </Button>
                <Button
                  color="primary"
                  //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                  onClick={ () => handleExportData(tableData,columns, csvExporter)}
                  startIcon={<FileDownloadIcon />}
                  variant="contained"
                >
                  Export All Data
                </Button>
              </Box>
            )}
          />
          <CreateNewProjectModal
            handleAddRow={handleAddRow}
            columns={columns}
            open={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            fetchApplications={fetchApplications}
            projects={tableData}
          />
          <EditProjectModal
            handleSaveRowEdits={handleSaveRowEdits}
            columns={columns}
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            fetchApplications={fetchApplications}
            projects={tableData}
            editingRow={editingRow}
            values={editingValues}
            setValues={setEditingValues}
          />
        </>
      )}
    </Box>
  );
};

//Modal to create new project
export const CreateNewProjectModal = ({ open, columns, onClose, fetchApplications, handleAddRow, projects }) => {

  const cellValueMap = [
    { value: 'new', label: 'success' },
    { value: 'interested students', label: 'warning' },
    { value: 'students needed', label: 'primary' },
    { value: 'pending approval', label: 'secondary' },
    { value: 'assigned', label: 'error' },
    { value: 'proposed', label: 'default' }
  ];
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {}),
  );

  const [error, setError] = useState("")

  function validateFields() {
    if (values["project"] === "") {
      setError("Please Enter a project Name")
      setTimeout(() => setError(""), 4000);
      return false
    }

    if (projects.length === undefined){
      return true
    }

    let project = projects.find((project) => project.project.toLowerCase() === values["project"].toLowerCase());
    if (typeof project !== "undefined") {
      setError("The project name already exists")
      setTimeout(() => setError(""), 4000);
      return false
    }

    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateFields() === false) {
      return
    }

    handleAddRow(values);
    Object.entries(values).map(([key, value]) => {
      values[key] = ''
    })
    onClose();
  };

  return (
    <Dialog open={open}>
      {error === "" ? "" : <Alert severity="error">{error}</Alert>}
      <DialogTitle textAlign="center">Create New Project</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >
            {columns.map((column) => {
              if (column.accessorKey === 'interested groups' || column.accessorKey === 'group') {
                return null
              }
              if (column.accessorKey === 'status') {
                return (
                  <FormGroup>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                      labelId='status-label'
                      key={column.accessorKey}
                      label={column.header}
                      name={column.accessorKey}
                      value={values[column.accessorKey]}
                      onChange={(e) => {
                        setValues({ ...values, [e.target.name]: e.target.value })
                      }}
                    >
                      {cellValueMap.map((option) => (
                        <MenuItem key={option.value} value={option.value} >
                          {option.value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormGroup>
                )
              }
              return (
                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  value={values[column.accessorKey]}
                  onChange={(e) => {
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }}
                  multiline={column.accessorKey === "description"}
                  rows={column.accessorKey === "description" ? 5 : 1}
                />
              )
            })}

          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="secondary" type="submit" variant="contained">
            Create New Project
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export const EditProjectModal = ({ open, columns, onClose, fetchApplications, handleSaveRowEdits, projects,editingRow, values ,setValues}) => {
  const cellValueMap = [
    { value: 'new', label: 'success' },
    { value: 'interested students', label: 'warning' },
    { value: 'students needed', label: 'primary' },
    { value: 'pending approval', label: 'secondary' },
    { value: 'assigned', label: 'error' },
    { value: 'proposed', label: 'default' }
  ];
  

  const [error, setError] = useState("")

  function validateFields() {
    if (values["project"] === "") {
      setError("Please Enter a project Name")
      setTimeout(() => setError(""), 4000);
      return false
    }

    if (projects.length === undefined){
      return true
    }

    let project = projects.find((project) => project.project.toLowerCase() === values["project"].toLowerCase());
    if (project === undefined) {
      return true
    }
    
    if (project._id !== editingRow.original._id) {
      setError("The project name already exists")
      setTimeout(() => setError(""), 4000);
      return false
    }

    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateFields() === false) {
      return
    }

    handleSaveRowEdits(editingRow,values);
    onClose();
  };

  return (
    <Dialog open={open}>
      {error === "" ? "" : <Alert severity="error">{error}</Alert>}
      <DialogTitle textAlign="center">Edit Project</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >   
            {columns.map((column) => {
              if (column.accessorKey === 'interested groups' || column.accessorKey === 'group') {
                return null
              }
              if (column.accessorKey === 'status') {
                return (
                  <FormGroup>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                      labelId='status-label'
                      key={column.accessorKey}
                      label={column.header}
                      name={column.accessorKey}
                      value={values[column.accessorKey]}
                      onChange={(e) => {
                        setValues({ ...values, [e.target.name]: e.target.value })
                      }}
                    >
                      {cellValueMap.map((option) => (
                        <MenuItem key={option.value} value={option.value} >
                          {option.value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormGroup>
                )
              }
              return (
                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  value={values[column.accessorKey]}
                  onChange={(e) => {
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }}
                  multiline={column.accessorKey === "description"}
                  rows={column.accessorKey === "description" ? 5 : 1}
                />
              )
            })}

          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="secondary" type="submit" variant="contained">
            Edit Project
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};


//Modal to view application
export const ViewApplicationModal = ({ open, data, onClose, onSubmit, setShowAlert, project, fetchProjects }) => {
  const [textFieldFeedback, setTextFieldtextFieldFeedback] = useState("");
  const [status, setStatus] = useState("");

  let states = ["Accepted", "Rejected", "Feedback Provided"]

  const handleStatusChange = (e) => {
    setStatus(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    data.status = status
    fetch("api/application/review", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
    })
      .then((response) => { return response.json() })
      .then((data) => {
        fetchProjects()
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 5000);
      })
    onSubmit();
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle  >Project Application: </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <FormLabel component="legend">
                <Typography variant="body1" gutterBottom>
                  <Box fontWeight='fontWeightMedium' display='inline'>Group: </Box>
                </Typography>
                <Typography variant="body1" gutterBottom >
                  <Box display='center'>{data.group_id}</Box>
                </Typography >
                
              </FormLabel>
            </Grid>
          </Grid>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <FormLabel component="legend">
                <Typography variant="body1" gutterBottom >
                  <Box fontWeight='fontWeightMedium' display='inline'>submitted_by: </Box>
                </Typography >
                <Typography variant="body1" gutterBottom >
                  <Box display='center'>{data.submitted_by} </Box>
                </Typography >
              </FormLabel>
            </Grid>
          </Grid>
          <Grid>
          <FormGroup>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                      labelId='status-label'
                      onChange={handleStatusChange}
                    >
                      {states.map((state) => (
                        <MenuItem key={state} value={state} >
                          {state}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormGroup>
          </Grid>
          <FormLabel component="legend" sx={{ mt: 1 }}>
            <Box fontWeight='fontWeightMedium' display='inline'>Feedback: </Box>
          </FormLabel>
          <FormGroup row>
            <TextareaAutosize
              style={{ height: 'calc(1.5em + 100px)', width: 'calc(1.5em + 250px)'  }}
              name="feedback"
              multiline = {4}
              value={textFieldFeedback}
              onChange={(e) => {
                setTextFieldtextFieldFeedback(e.target.value);
              }}
            />
          </FormGroup>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="secondary" type="submit" onClick={handleSubmit} variant="contained">Review Application</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProjectTable;