import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import MaterialReactTable from 'material-react-table';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ExportToCsv } from 'export-to-csv'; //or use your library of choice here
import { Delete, Edit } from '@mui/icons-material';

const GroupTable = () => {
  
  // For the create profile modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  
  const fetchGroups = () => {
    fetch("/api/groups")
    .then(response => response.json())
    .then(data => {
      setTableData(data);
    })
    .catch(error => {
      console.error(error);
    });
  };
  
  useEffect(() => {
    fetchGroups();
  }, []);
  
  const columns = useMemo(() => [
    {
      accessorKey: 'group_id',
      header: 'Group',
    },
    {
      accessorKey: 'members',
      header: 'Members',
      Cell: ({ cell }) => {
        if (Array.isArray(cell.getValue("members")) && cell.getValue("members").length > 0) {
          return  cell.getValue("members").map((item,index) => <tr>{item}</tr>);
        }
      }
    },
    {
      accessorKey: 'project',
      header: 'Current Project',
    },
    {
      accessorKey: 'interest',
      header: 'Interested projects',
    },
    {
      accessorKey: 'notes',
      header: 'Notes'
    },
  ], []);
  
  const handleCreateNewRow = (values) => { };

  const handleAddRow = useCallback(
    (newRowData) => {

      fetch('api/group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRowData)
      })
        .then(response => {
          if (response.ok) {
            fetchGroups();
          }
        }).catch(error => {
          console.error(error);
        });
    },
    []
  );


  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      fetch(`api/group/update/${row.original._id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })
        .then(response => {
          if (response.ok) {
            fetchGroups();
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
        !window.confirm(`Are you sure you want to delete group: ${row.getValue('group_id')}`)
      ) {
        return;
      }
      fetch(`api/group/delete/${row.original._id}`, {
        method: "DELETE"
      })
        .then(response => {
          if (response.ok) {
            fetchGroups();
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
      <Typography variant="h2" align="center" fontWeight="fontWeightBold" sx={{ marginBottom: '0.5rem' }}>Groups</Typography>
       
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
              Create New Group
            </Button>
            <Button
              color="primary"
              onClick={handleExportData}
              startIcon={<FileDownloadIcon />}
              variant="contained"
            >
              Export All Data
            </Button>
          </Box>
        )}
      />  
      <CreateNewGroupModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
        onAddRow={handleAddRow}
        fetchGroups={fetchGroups}
      />
    </Box>
  );
};

//Modal to create new Group
export const CreateNewGroupModal = ({ open, columns, onClose, onSubmit, fetchGroups }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      if (column.accessorKey === 'project') {
        acc[column.accessorKey ?? ''] = 'not assigned';
      } else {
        acc[column.accessorKey ?? ''] = '';
      }
      return acc;
    }, {}),
  );

  const {
    control,
    handleSubmit: handleValidatedSubmit,
    formState: { errors },
  } = useForm();

  const [inputs, setInputs] = useState(['']);

  const addInput = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, ''])
    }
  }

  const handleInputChange = (index, value) => {
    const newInputs = [...inputs]
    newInputs[index] = value
    setInputs(newInputs)
  }

  const handleRemoveInput = (index) => {
    const newInputs = [...inputs]
    newInputs.splice(index, 1)
    setInputs(newInputs)
  }
 
  const handleSubmit = () => {
    
    fetch("api/group", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    })
      .then(response => {
        if (response.ok) {
          fetchGroups();
          setValues({});
          setInputs([]);
        }
      })
      .catch(error => {
        console.error(error);
      });

    onSubmit(values);
    onClose();
  };
 
  const handleFormSubmit = (data) => {
    handleValidatedSubmit(() => handleSubmit(data))(data);
  };
  return (

    <form onSubmit={handleValidatedSubmit(handleSubmit)}>
      <Dialog open={open}>
        <DialogTitle textAlign="center">Create New Group</DialogTitle>
        <DialogContent>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
              marginTop: '0.5rem',
            }}
          >
            {columns.map((column) => {
              if (column.accessorKey === 'project' || column.accessorKey === 'interest') {
                return null;
              }
              if (column.accessorKey === 'members') {
                const inputFields = inputs.map((input, i) => (
                  <div key={`student-${i}`} style={{ display: 'block', marginTop: "0.5rem" }}>
                  <TextField
                    label={`Student ${i + 1}`}
                    value={input}
                    onChange={(e) => handleInputChange(i, e.target.value)}
                  />
                  <Button onClick={() => handleRemoveInput(i)}>Remove</Button>
                </div>
                ))

                return (
                  <div>
                    {inputFields}
                    {inputs.length < 5 && (
                      <div style={{ display: 'block' }}>
                        <Button onClick={addInput}>Add Student</Button>
                      </div>
                    )}
                  </div>
                )
              }
              return (
                <Controller
                  key={column.accessorKey}
                  name={column.accessorKey}
                  control={control}
                  defaultValue={column.accessorKey === 'project' ? 'not assigned' : ''}
                  rules={{
                    required: column.accessorKey !== 'notes' ? `${column.header} is required.` : false,
                  }}
                  render={({ field }) => (
                    <TextField
                      label={
                        `${column.header}${column.accessorKey !== 'notes' ? ' *' : ''}`
                      }
                      error={!!errors[column.accessorKey]}
                      helperText={errors[column.accessorKey]?.message}
                      {...field}
                    />
                  )}
                />
              );
            })}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="secondary" onClick={handleValidatedSubmit(handleSubmit)} variant="contained" type="submit">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default GroupTable;
