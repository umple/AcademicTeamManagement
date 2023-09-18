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
  FormControlLabel,
  Checkbox,
  FormLabel,
  FormGroup,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
  TextareaAutosize,
  Alert,
  Snackbar,
  Tab
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ExportToCsv } from 'export-to-csv';
import { Delete, Edit, Help } from '@mui/icons-material';
import Chip from '@mui/material/Chip';
import { colorStatus } from '../../../Utils/statusColors';

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
      // {
      //   accessorKey: 'interested groups',
      //   header: 'Interested Groups',
      //   Cell: ({ cell }) => {
      //     if (Array.isArray(cell.getValue("interested groups")) && cell.getValue("interested groups").length > 0) {
      //       return cell.getValue("interested groups").map((item, index) => <tr>{item}</tr>);
      //     }
      //   }
      // },
      {
        accessorKey: 'group',
        header: 'Group',
      },
      // {
      //   accessorKey: 'visibility',
      //   header: 'Visibility',
      // },
      {
        accessorKey: 'notes',
        header: 'Notes'
      },
    ],
    [],
  );

  // For the create profile modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [applications, setApplications] = useState([]);


  const fetchProjects = () => {
    fetch("/api/projects")
      .then(response => response.json())
      .then(data => {
        setTableData(data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const fetchApplications = () => {
    fetch("api/project/applications").then(response => response.json())
      .then(data => {
        setApplications(data);
        console.log(applications)
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
      fetch('/api/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRowData)
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

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      fetch(`api/project/update/${row.original._id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })
        .then(response => {
          if (response.ok) {
            fetchProjects();
          } else {
            console.error("Error deleting row");
          }
        })
        .catch(error => {
          console.error(error);
        });
      exitEditingMode();
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
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

  function getDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
  }

  // For exporting the table data
  const csvOptions = {
    filename: 'ProjectsFromAcTeams-' + getDate(),
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: true,
  };

  const csvExporter = new ExportToCsv(csvOptions);

  const handleExportData = () => {
    // clean up and organize data to be exported
    const keyToRemove = "_id"
    const updatedJsonList = tableData.map(jsonObj => {
      let updatedJsonObject = jsonObj
      // remove the _id as that should not be in the json
      if (keyToRemove in jsonObj) {
        const { [keyToRemove]: deletedKey, ...rest } = jsonObj // use destructuring to remove the key
        updatedJsonObject = rest // return the updated JSON object without the deleted key
      }

      // sort the keys as they appear in the columns
      const orderedKeys = columns.map(key => key.accessorKey)
      updatedJsonObject = Object.keys(updatedJsonObject)
        .sort((a, b) => orderedKeys.indexOf(a) - orderedKeys.indexOf(b)) // sort keys in the order of the updated keys
        .reduce((acc, key) => ({ ...acc, [key]: updatedJsonObject[key] }), {}) // create a new object with sorted keys

      // replace the accessor key by the header
      for (let i = 0; i < columns.length; i++) {
        const { accessorKey, header } = columns[i]
        if (accessorKey in updatedJsonObject) {
          const { [accessorKey]: renamedKey, ...rest } = updatedJsonObject // use destructuring to rename the key
          updatedJsonObject = { ...rest, [header]: renamedKey } // update the JSON object with the renamed key
        }
      }

      return updatedJsonObject // return the original JSON object if the key is not found
    })

    csvExporter.generateCsv(updatedJsonList);
  };
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
            editingMode="modal"
            enableColumnOrdering
            enableColumnResizing
            columnResizeMode="onChange" //default is "onEnd"
            defaultColumn={{
              minSize: 100,
              size: 150, //default size is usually 180
            }}
            enableEditing
            initialState={{ showColumnFilters: false, density: 'compact' }}
            onEditingRowSave={handleSaveRowEdits}
            onEditingRowCancel={handleCancelRowEdits}
            renderDetailPanel={({ row, index }) => {
              return (
                <Grid container spacing={2}>
                  {/* <Grid item>
                    <TableContainer component={Paper}>
                      <Table size="small" aria-label="a dense table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Interested Students</TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {applications && Object.keys(applications).length !== 0 ? (
                            Object.entries(applications).map(([project, groups], outerIndex) => (
                              outerIndex === row.index && typeof groups !== 'undefined' ? (
                                Object.entries(groups).map(([group_id, groupApplication]) => (
                                  <>
                                    {groupApplication && groupApplication.members && groupApplication.members.map((member, innerIndex) => (
                                      <TableRow
                                        key={innerIndex}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                      >
                                        <TableCell>
                                          {member}
                                        </TableCell>
                                        <TableCell align="right">
                                          <Button
                                            variant="outlined"
                                            color="warning"
                                            onClick={() => {
                                              console.info('View Profile', member);
                                            }}
                                          >
                                            View Profile
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </>
                                ))
                              ) : (
                                null
                              ))
                            )) : null
                          }
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid> */}

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
                  <IconButton onClick={() => table.setEditingRow(row)}>
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
                  onClick={handleExportData}
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

    console.log(projects.length)
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

  // const handleSendFeedback = (event) => {
  //   event.preventDefault()

  //   const myObject = {
  //     'feedback': textFieldFeedback,
  //     'group_id': data.group_id,
  //   }
  //   fetch("api/send/feedback/to/group", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify(myObject),
  //   })
  //     .then((response) => { return response.json() })
  //     .then((data) => {
  //       setTextFieldtextFieldFeedback('')
  //       setShowAlert(true);
  //       setTimeout(() => setShowAlert(false), 5000);
  //     })
  //   onClose();
  // }


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
          
          {/* <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <FormLabel component="legend">
                <Typography variant="body1" gutterBottom>
                  <Box fontWeight='fontWeightMedium' display='inline'>Description: </Box>
                </Typography>
                {data.notes}
              </FormLabel>
            </Grid>
          </Grid> */}
          {/* <Grid container alignItems="center" spacing={2} sx={{ mt: 1 }}>
            <Grid item>
              <FormLabel component="legend">
                <Box fontWeight='fontWeightMedium' display='inline'>More students needed </Box>
                <Tooltip title="Changes status to 'students needed' if ASSIGN button pressed" placement='right'>
                  <Help />
                </Tooltip>
              </FormLabel>
              <FormGroup row>
                <FormControlLabel
                  control={<Checkbox />}
                  value={studentsNeeded}
                  onChange={(e) => {
                    setStudentsNeeded(e.target.value);
                  }}
                />
              </FormGroup>
            </Grid>
          </Grid> */}
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