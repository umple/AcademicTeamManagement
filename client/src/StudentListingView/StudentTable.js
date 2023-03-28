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
  Typography,
  FormControl,
  FormHelperText
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { ExportToCsv } from 'export-to-csv';
import { Delete, Edit, Help } from '@mui/icons-material';
import PublishIcon from '@mui/icons-material/Publish';


const useStyles = makeStyles((theme) => ({
  input: {
    display: "none",
  },
}));



const StudentTable = () => {
  // Columns for table
  const columns = useMemo(
    () => [
      {
        accessorKey: 'orgDefinedId',
        header: 'ID',
      },
      {
        accessorKey: 'username',
        header: 'Username',
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'section',
        header: 'Section',
      },
      {
        accessorKey: 'notes',
        header: 'Notes',
      },
    ],
    [],
  );


  // For the create profile modal
  const classes = useStyles();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    fetch("/api/students")
      .then(response => response.json())
      .then(data => {
        setTableData(data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleChange = (event) => {
    setFile(event.target.files[0]);
  };


  const handleAddRow = useCallback(
    (newRowData) => {
      setIsLoading(true);
      fetch('api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRowData)
      })
        .then(response => response.json())
        .then(data => {
          setIsLoading(false);
          setTableData(prevState => [...prevState, data]);
        })
        .catch(error => {
          setIsLoading(false);
          console.error(error);
        });
    },
    []
  );


  const handleCreateNewRow = (values) => { };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      fetch(`api/stdent/update/${row.original._id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })
        .then(response => {
          if (response.ok) {
            setIsLoading(false);
            const updatedData = tableData.filter(
              (data) => data._id !== row.original._id
            );
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


  // For the model to view student applications
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

  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  
  const handleImportSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please select a file.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("api/importStudent", {
        method: "POST",
        body: formData,
      });
      const excelData = await response.json();
      console.log(excelData)

    } catch (error) {
      setError(error.message);
    }
  };

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
            const updatedData = tableData.filter(
              (data) => data._id !== row.original._id
            );
            setTableData(updatedData);
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
            <form onSubmit={handleImportSubmit}>
                <Box sx={{ display: 'flex', gap: '1rem', p: '0.5rem' }}>
                  <input
                    accept="*"
                    className={classes.input}
                    id="contained-button-file"
                    type="file"
                    onChange={handleChange}
                    startIcon={<FileUploadIcon />}
                  />
                  <label htmlFor="contained-button-file">
                    <Button variant="contained" component="span" color="success">
                      Upload
                    </Button>
                  </label>
                  {file && (
                    <Typography variant="subtitle1">{file.name}</Typography>
                  )}
                  {error && <FormHelperText error>{error}</FormHelperText>}
                  <label>
                    <Button type="submit" component="span" color="secondary" variant="contained" endIcon={<PublishIcon />}>
                      Submit
                    </Button>
                  </label>

                </Box>
            </form>

            {/* <Button
              color="secondary"
              startIcon={<FileUploadIcon />}
              onSubmit={handleImportSubmit}
              variant="contained"
            >
              Import Students
            </Button> */}
          </Box>
        )}
      />
      <CreateNewStudentModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
        onAddRow={handleAddRow}
      />
    </Box>
  );
};

//Modal to create new student
export const CreateNewStudentModal = ({ open, columns, onClose, onSubmit }) => {
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
        console.log(response);
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
