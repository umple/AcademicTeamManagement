import React, { useCallback, useState, useMemo } from 'react';
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
  Modal
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ExportToCsv } from 'export-to-csv'; //or use your library of choice here
import { Delete, Edit } from '@mui/icons-material';

// Mock data for table
const data = [
  {
    project: 'Potential project A: Mobile pre-surgery app for CHEO',
    description: 'The customers write "Dr. Byrns and I started collaborating a few years ago on a mobile application to help teenagers and parents of kids awaiting surgery at CHEO better comply with fasting instructions and illness reporting in order to avoid (expensive) surgery cancellations. We have a good working Android prototype already and will have a pilot study deployed shortly.',
    client: 'Daniel Amyot',
    visibility: 'visible',
    interest: '0',
    status: 'untouched',
    group: 'not assigned',
    notes: 'Requires at least 3 students',
  },
  {
    project: 'Potential project B: Exam database for Faculty of Medicine',
    description: 'The Undergraduate (UG) team at the Department of Family Medicine (DFM) currently has the responsibility to create exams for the medical students every 12 weeks.  The UG exam questions are currently stored within an excel spreadsheet and have a number of columns that require calculations.',
    client: 'Marisa Duval',
    visibility: 'hidden',
    interest: '4',
    status: 'assigned',
    group: '21',
    notes: 'Maximum 2 students',
  },
  {
    project: 'Potential project C: Enhancements to "Sim City" project for Faculty of Medicine',
    description: 'A capstone group in 2022 has worked on software to help medical residents learn what it is like to practice, by simulating various practical situations in a gamified manner. This project would continue to develop that system.',
    client: 'Marisa Duval',
    visibility: 'visible',
    interest: '5',
    status: 'students needed',
    group: '13',
    notes: 'Requires 2 more students',
  },
  {
    project: 'Project G: Academic Team Project managemente',
    description: 'A capstone group in 2022 has worked on software to help medical residents learn what it is like to practice, by simulating various practical situations in a gamified manner. This project would continue to develop that system.',
    client: 'Marisa Duval',
    visibility: 'visible',
    interest: '6',
    status: 'interested students',
    group: 'not assigned',
    notes: 'Requires at least 4 students',
  },
  {
    project: 'Potential project set E: Umple enhancements',
    description: 'Umple is now being used extensively, with about one "compilation" per second in UmpleOnline. Umple is designed to allow real systems to be built by generating code in multiple languages from state machines and data models. It also generates diagrams so code becomes self-documenting.',
    client: 'Timothy Lethbridge',
    visibility: 'visible',
    interest: '8',
    status: 'pending approval',
    group: 'not assigned',
    notes: 'Requires at least 4 students',
  },
];



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
                    cell.getValue() === 'untouched'
                      ? theme.palette.success.light
                      : cell.getValue() === 'interested students'
                      ? theme.palette.warning.light
                      : cell.getValue() === 'students needed'
                      ? theme.palette.primary.light
                      : cell.getValue() === 'pending approval'
                      ? theme.palette.secondary.main
                      : cell.getValue() === 'assigned'
                      ? theme.palette.error.dark
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
            accessorKey: 'interest',
            header: 'Interest',
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


  // For the create profile modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState(() => data);
  const [validationErrors, setValidationErrors] = useState({});

  const handleCreateNewRow = (values) => {
    tableData.push(values);
    setTableData([...tableData]);
    console.log(tableData)
    console.log(columns)
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      tableData[row.index] = values;
      setTableData([...tableData]);
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

  const style = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  
  // To delete the row
  const handleDeleteRow = useCallback(
    (row) => {
      if (
        !window.confirm(`Are you sure you want to delete ${row.getValue('firstName')}`)
      ) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render
      tableData.splice(row.index, 1);
      setTableData([...tableData]);
    },
    [tableData],
  );

  // For exporting the table data
  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns.map((c) => c.header),
  };

  const csvExporter = new ExportToCsv(csvOptions);

  const handleExportData = () => {
    csvExporter.generateCsv(data);
  };

  // Mock data to show interested students
  const interestedStudents = [
    { name: 'Jane Doe'},
    { name: 'Calvin Klein'},
    { name: 'Richard Brown'}
  ];

  // Mock data to show project applications
  const applications = [
    { group: '21', date: 'January 1, 2023', description: 'After interviewing with the client we received confirmation by email that the client picked our team for the project.'},
    { group: '27', date: 'January 10, 2023', description: 'After talking to the customer, they said that they are interested in having us develop their application.'}
  ];
  
   
  return(
  <Box sx={{ p: 2 }}>
    <MaterialReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center',
            },
            size: 120,
          },
        }}
        muiTablePaginationProps={{
          rowsPerPageOptions: [5,50,100,150,200,250],
          showFirstButton: false,
          showLastButton: false,
        }}
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
        renderDetailPanel={({ row }) => (
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
                    {interestedStudents.map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell >
                          {row.name}
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
                <Table sx={{ }} size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Project Applications</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applications.map((row) => (
                      <TableRow
                        key={row.group}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell >
                          {"Group:".concat(" ", row.group)}
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
                              data={row}
                              open={open}
                              onClose={handleClose}
                              onSubmit={() => setOpen(false)}
                            />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
        </Grid>
        )}
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
      />
  </Box>
  );
};

//Modal to create new project
export const CreateNewProjectModal = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {}),
  );

  const handleSubmit = () => {
    //put your validation logic here
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Project</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >
            {columns.map((column) => (
              <TextField
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            ))}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Create New Project
        </Button>
      </DialogActions>
    </Dialog>
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
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >
            <Box sx={{ width: '100%', maxWidth: 500 }}>
              <Typography variant="body1" gutterBottom>
              <Box fontWeight='fontWeightMedium' display='inline'>Group: </Box>
              {data.group}
              </Typography>
              <Typography variant="body1" gutterBottom>
              <Box fontWeight='fontWeightMedium' display='inline'>Description: </Box>
              {data.description}
              </Typography>
            </Box>
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" onClick={onClose} variant="contained">Reject</Button>
        <Button color="success" onClick={handleSubmit} variant="contained">
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectTable;
