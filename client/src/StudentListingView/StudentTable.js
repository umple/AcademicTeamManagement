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
  Tooltip
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ExportToCsv } from 'export-to-csv';
import { Delete, Edit } from '@mui/icons-material';
import ImportStudents from '../ImportStudentsView/ImportStudents';


const useStyles = makeStyles((theme) => ({
  input: {
    display: "none",
  },
}));



const StudentTable = () => {

  const defaultColumns = useMemo(
    () => [
      {
        accessorKey: 'orgDefinedId',
        header: 'orgDefinedId',
      },
      {
        accessorKey: 'username',
        header: 'Username',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'section',
        header: 'Section',
      },
      {
        accessorKey: 'calculated final grade numerator',
        header: 'Calculated Final Grade Numerator',
      },
      {
        accessorKey: 'calculated final grade denominator',
        header: 'Calculated Final Grade Denominator',
      },
      {
        accessorKey: 'adjusted final grade numerator',
        header: 'Adjusted Final Grade Numerator',
      },
      {
        accessorKey: 'adjusted final grade denominator',
        header: 'Adjusted Final Grade Denominator',
      },
    ],
    [],
  );

  // For the create profile modal
  const [columns, setColumns] = useState([]);
  const classes = useStyles();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setIsLoading] = useState(false);


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
        setTableData(data);
      })
      .catch(error => {
        console.error('There was a problem with the network request:', error);
      });
  };

  const readSavedJson = async () => { 
    const userColumnsData = localStorage.getItem("userColumns");
    
    if (userColumnsData === null || typeof userColumnsData === "undefined") {
      setColumns(defaultColumns);
    } else {
      const userColumnsArray = JSON.parse(userColumnsData);
      setColumns(userColumnsArray);
    }
  }  

  useEffect(() => {
    fetchStudents();
  }, []);
  useEffect(() => {
    readSavedJson();
  }, [columns]);

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

  function updateColumns(newcolumns){
    setColumns(newcolumns)
    localStorage.setItem("userColumns",JSON.stringify(newcolumns))
  }

  // For the model to view student applications
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // To delete the row
  const handleDeleteRow = useCallback(
    (row) => {
      if (
        !window.confirm(`Are you sure you want to delete ${row.getValue('firstName')}`)
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
    csvExporter.generateCsv(tableData);
  };
 
  return (
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
              onClick={handleExportData}
              startIcon={<FileDownloadIcon />}
              variant="contained"
            >
              Export All Data
            </Button>

            <ImportStudents fetchStudents={fetchStudents} updateColumns={updateColumns} ></ImportStudents>
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
    fetch("api/student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    })
      .then(response => {
        if (response.ok) {
          fetchStudents();
        }
      })
      .catch(error => {
        console.error(error);
      });
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Student</DialogTitle>
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
          Create New Student
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentTable;
