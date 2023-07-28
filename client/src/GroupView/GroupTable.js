import React, { useCallback, useState, useMemo, useEffect } from 'react';
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
  Select,
  MenuItem,
  cellValueMap,
  InputLabel
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ExportToCsv } from 'export-to-csv'; //or use your library of choice here
import { Delete, Edit } from '@mui/icons-material';
import { FormControl } from '@material-ui/core';

const GroupTable = () => {

  // For the create profile modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [projects, setProjects] = useState([])
  const fetchData = () => {

    Promise.all(
      [
        fetch("/api/groups"),
        fetch("/api/projects")
      ])
      .then(([resGroups, resProjects]) => 
      Promise.all([resGroups.json(), resProjects.json()])
      ).then(([groups, projects]) => {
        setTableData(groups)
        projects = projects.filter(project => project.status != "assigned")
        setProjects(projects)
      });

  };



  useEffect(() => {
    fetchData();
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
          return cell.getValue("members").map((item, index) => <tr>{item}</tr>);
        }
      }
    },
    {
      accessorKey: 'project',
      header: 'Project',
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
            fetchData();
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
            fetchData();
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
            fetchData();
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
    filename: 'GroupsFromAcTeams-' + getDate(),
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

  function getDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
  }

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
        fetchData={fetchData}
        projects = {projects}
      />
    </Box>
  );
};

//Modal to create new Group
export const CreateNewGroupModal = ({ open, columns, onClose, onSubmit, fetchData, projects }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {}),
  );

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
  values["members"] = inputs
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
          fetchData();
          Object.entries(values).map(([key,value]) =>{
            if (key == 'members'){
              values[key] = []
            } else {
              values[key] = ''
            }
          }) 
          setInputs([])
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
      <DialogTitle textAlign="center">Create New Group</DialogTitle>
      <form onSubmit={(e) => e.preventDefault()}>
        <DialogContent>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >
            
            {columns.map((column) => {

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

              if (column.accessorKey === 'project') {
                return (
                  <FormControl>
                  <InputLabel id = "project-label">Project</InputLabel>
                  <Select
                    labelId = "project-label"
                    key={column.accessorKey}
                    name={column.accessorKey}
                    value={values[column.accessorKey]}
                    onChange={(e) => {
                      setValues({ ...values, [e.target.name]: e.target.value })
                    }}
                  >
                    {projects.map((option) => (
                      <MenuItem key={option.project} value={option.project} >
                        {option.project}
                      </MenuItem>
                    ))}
                  </Select>
                  </FormControl>
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
          <Button color="secondary" onClick={handleSubmit} variant="contained">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default GroupTable;
