import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
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
  Typography
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ExportToCsv } from 'export-to-csv';
import { Delete, Edit } from '@mui/icons-material';
import ImportStudents from '../ImportStudentsView/ImportStudents';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { FileUpload as FileUploadIcon } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { Paper } from '@material-ui/core';
import { csvOptions, handleExportData } from '../../helpers/exportData';
import { FilterDataByProfessor } from '../../helpers/FilterDataByValue';



const useStyles = makeStyles((theme) => ({
  input: {
    display: "none",
  },
  dialogTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '& h2': {
      fontWeight: 'bold',
    },
  },
  closeButton: {
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  modalContent: {
    padding: theme.spacing(2),
  },
}));

const StudentTable = () => {

  const defaultColumns = useMemo(
    () => [
      {
        accessorKey: 'orgdefinedid',
        header: 'orgDefinedId',
      },
      {
        accessorKey: 'username',
        header: 'Username',
      },
      {
        accessorKey: 'lastname',
        header: 'Last Name',
      },
      {
        accessorKey: 'firstname',
        header: 'First Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'sections',
        header: 'Section',
      },
      {
        accessorKey: 'final grade',
        header: 'Final Grade',
      },
    ],
    [],
  );

  // For the create profile modal
  const [columns] = useState(defaultColumns);
  const classes = useStyles();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [importSuccess, setImportSuccess] = useState(false);

  function handleImportSuccess(success) {
    setImportSuccess(success);
    if (success) {
      setTimeout(() => setImportSuccess(false), 4000); // 5 seconds delay
    }
  }

  const fetchStudents = async () => {
    fetch('/api/students')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('There is no Students');
        }
      })
      .then(data => {
        const professorEmail = JSON.parse(localStorage.getItem('userEmail')) // get the cached value of the professor's email
        const filteredStudentsTableData = FilterDataByProfessor(data, professorEmail) // keep only the data that contains the professor's email
        setTableData(filteredStudentsTableData);
      })
      .catch(error => {
        console.error('There was a problem with the network request:', error);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddRow = useCallback(
    (newRowData) => {
      fetch('api/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRowData)
      })
        .then(response => response.json())
        .then(data => {
          fetchStudents();
        })
        .catch(error => {
          console.error(error);
        });
    },
    []
  );

  const handleCreateNewRow = (values) => { };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      fetch(`api/student/update/${row.original._id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })
        .then(response => {
          if (response.ok) {
            fetchStudents();
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

  // To delete the row
  const handleDeleteRow = useCallback(
    (row) => {
      if (
        !window.confirm(`Are you sure you want to delete ${row.getValue('username')}`)
      ) {
        return;
      }
      fetch(`api/student/delete/${row.original._id}`, {
        method: "DELETE"
      })
        .then(response => {
          if (response.ok) {
            fetchStudents();
          } else {
            console.error("Error deleting row");
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    [tableData],
  );
  
  const csvExporter = new ExportToCsv(csvOptions("StudentsFromAcTeams-"));

  const [isImportModalOpen, setImportModalOpen] = useState(false);

  const closeModal = () => {
    setImportModalOpen(false);
  }


  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h2" align="center" fontWeight="fontWeightBold" sx={{ marginBottom: '0.5rem' }}>Students</Typography>
      {importSuccess && <Alert severity="success">
        <AlertTitle>Success</AlertTitle>
        success alert — <strong>successfully imported students!</strong>
      </Alert>}
      <MaterialReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center',
            },
            size: 120,
          },
        }}
        enablePagination={true}
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
          <Box sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexDirection: 'row' }}>
            <Button
              color="success"
              onClick={() => setCreateModalOpen(true)}
              variant="contained"
            >
              Create New Student
            </Button>
            <Button
              color="primary"
              //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
              onClick={handleExportData(tableData,columns, csvExporter)}
              startIcon={<FileDownloadIcon />}
              variant="contained"
            >
              Export All Data
            </Button>
            <Button
              color="warning"
              onClick={() => setImportModalOpen(true)}
              startIcon={<FileUploadIcon />}
              variant="contained"
            >
              Import Students
            </Button>

            <Dialog PaperComponent={Paper} PaperProps={{ className: classes.dialogPaper }} scroll='paper' open={isImportModalOpen} onClose={() => setImportModalOpen(false)}>
              <DialogTitle className={classes.dialogTitle}>Import Students  <IconButton className={classes.closeButton} onClick={() => setImportModalOpen(false)}>
                <CloseIcon />
              </IconButton></DialogTitle>


              <ImportStudents
                fetchStudents={fetchStudents}
                columns={columns}
                handleImportSuccess={handleImportSuccess}
                closeModal={closeModal}
              />

            </Dialog>
          </Box>
        )}
      />
      <CreateNewStudentModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
        onAddRow={handleAddRow}
        fetchStudents={fetchStudents}
      />
    </Box>
  );
};

//Modal to create new student
export const CreateNewStudentModal = ({ open, columns, onClose, onSubmit, fetchStudents }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {}),
  );

  const handleSubmit = () => {

    // add the professor's email to the newely created student
    const professorEmail = JSON.parse(localStorage.getItem('userEmail')) // get the cached value of the professor's email
    const newStudentInfo = { ...values, professorEmail: professorEmail } // add the professor's email as a new pair

    fetch("api/student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newStudentInfo)
    })
      .then(response => {
        if (response.ok) {
          fetchStudents();
        }
      })
      .catch(error => {
        console.error(error);
      });
    onSubmit(newStudentInfo);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Student</DialogTitle>
      <form onSubmit={(e) => e.preventDefault()}>
        <DialogContent>
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
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="secondary" onClick={handleSubmit} variant="contained">
            Create New Student
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StudentTable;
