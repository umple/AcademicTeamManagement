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
  InputLabel
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ExportToCsv } from 'export-to-csv';
import { Delete, Edit, Help } from '@mui/icons-material';
import { createTheme } from '@mui/material/styles';


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
        accessorKey: 'client',
        header: 'Client',
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
        accessorKey: 'interested groups',
        header: 'Interested Groups',
      },
      {
        accessorKey: 'group',
        header: 'Group',
      },
      {
        accessorKey: 'visibility',
        header: 'Visibility',
      },
      {
        accessorKey: 'notes',
        header: 'Notes'
      },
    ],
    [],
  );

  // Mock data to show project applications
  const defaultApp = [
    { group: '21', date: 'January 1, 2023', description: 'After interviewing with the client we received confirmation by email that the client picked our team for the project.' },
    { group: '27', date: 'January 10, 2023', description: 'After talking to the customer, they said that they are interested in having us develop their application.' }
  ];


  // For the create profile modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [applications, setApplications] = useState({});


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

  const fetchInterestedGroup = () => {
    fetch("api/retrieve/interested/groups").then(response => response.json())
      .then(data => {
        setApplications(data);
      })
      .catch(error => {
        console.error(error);
      }); 
  }

  useEffect(() => {
    fetchProjects();
    fetchInterestedGroup();
  }, []);

  const [validationErrors, setValidationErrors] = useState({});

  const handleCreateNewRow = (values) => { };

  const handleAddRow = useCallback(
    (newRowData) => {
      setIsLoading(true);
      fetch('api/project', {
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


  // For the model to view project applications
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);



  // To delete the row
  const handleDeleteRow = useCallback(
    (row) => {
      if (!window.confirm(`Are you sure you want to delete ${row.getValue('Project')}`)) {
        return;
      }

      fetch(`api/project/delete/${row.original._id}`, {
        method: "DELETE"
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
    },
    [],
  );

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
      console.log(orderedKeys)
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

  // Mock data to show interested students
  const interestedStudents = [
    { name: 'Jane Doe' },
    { name: 'Calvin Klein' },
    { name: 'Richard Brown' }
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h2" align="center" fontWeight="fontWeightBold" sx={{ marginBottom: '0.5rem' }}>Projects</Typography>
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
            <Grid item>
              <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Interested Students</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applications[row.index].members.map((item) => (
                      <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell>
                          {item}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            color="warning"
                            onClick={() => {
                              console.info('View Profile', row);
                            }}
                          >
                            View Profile
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item>
              <TableContainer component={Paper}>
                <Table sx={{}} size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Project Applications</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applications[row.index] && (
                      <TableRow
                        key={row.group_id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell>
                          {applications[row.index].group_id}
                          {/* {"Group:".concat(" ",  applications[row.index])} */}
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
                            data={applications[row.index]}
                            open={open}
                            onClose={handleClose}
                            onSubmit={() => setOpen(false)}
                          />
                        </TableCell>
                      </TableRow>
                    )}
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
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
        onAddRow={handleAddRow}
        fetchProjects={fetchProjects}
      />
    </Box>
  );
};

//Modal to create new project
export const CreateNewProjectModal = ({ open, columns, onClose, onSubmit, fetchProjects }) => {

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

  const handleSubmit = () => {
    fetch("api/project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    })
      .then(response => {
        if (response.ok) {
          fetchProjects();
          setValues({});
        }
      })
      .catch(error => {
        console.error(error);
      });
    onSubmit(values);
    onClose();
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Dialog open={open}>
        <DialogTitle textAlign="center">Create New Project</DialogTitle>
        <DialogContent>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >
            {columns.map((column) => {
              if (column.accessorKey === 'status') {
                return (
                  <Select
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
                />
              )
            })}

          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="secondary" onClick={handleSubmit} variant="contained" type="submit">
            Create New Project
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};


//Modal to view application
export const ViewApplicationModal = ({ open, data, onClose, onSubmit }) => {

  const handleSubmit = () => {
    //put your validation logic here
    onSubmit();
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Project Application</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <FormLabel component="legend">
                <Typography variant="body1" gutterBottom>
                  <Box fontWeight='fontWeightMedium' display='inline'>Group: </Box>
                </Typography>
                {data.group_id}
              </FormLabel>
            </Grid>
          </Grid>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <FormLabel component="legend">
                <Typography variant="body1" gutterBottom>
                  <Box fontWeight='fontWeightMedium' display='inline'>Description: </Box>
                </Typography>
                {data.notes}
              </FormLabel>
            </Grid>
          </Grid>
          <Grid container alignItems="center" spacing={2} sx={{ mt: 1 }}>
            <Grid item>
              <FormLabel component="legend">
                <Box fontWeight='fontWeightMedium' display='inline'>More students needed </Box>
                <Tooltip title="Changes status to 'students needed' if ASSIGN button pressed" placement='right'>
                  <Help />
                </Tooltip>
              </FormLabel>
              <FormGroup row>
                <FormControlLabel
                  value="start"
                  control={<Checkbox />}
                />
              </FormGroup>
            </Grid>
          </Grid>
          <FormLabel component="legend" sx={{ mt: 1 }}>
            <Box fontWeight='fontWeightMedium' display='inline'>Feedback: </Box>
          </FormLabel>
          <FormGroup row>
            <TextField
              sx={{ mt: 1 }}
              fullWidth
              multiline
              maxRows={5}
              hiddenLabel
            />
          </FormGroup>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={onClose} variant="contained">Send Feedback</Button>
        <Button color="success" onClick={handleSubmit} variant="contained">
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectTable;
