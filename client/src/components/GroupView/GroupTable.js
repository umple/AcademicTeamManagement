import { FormControl } from '@material-ui/core';
import { Delete, Edit } from '@mui/icons-material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import { ExportToCsv } from 'export-to-csv'; //or use your library of choice here
import MaterialReactTable from 'material-react-table';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FilterDataByProfessor } from '../../helpers/FilterDataByValue';
import { getDate } from '../../helpers/dateHelper';

const GroupTable = () => {

  // For the create profile modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [projects, setProjects] = useState([])
  const [students, setStudents] = useState([])
  const [message, setMessage] =  useState("")

  const fetchData = () => {
    Promise.all(
      [
        fetch("/api/groups"),
        fetch("/api/projects"),
        fetch("/api/students")
      ])
      .then(([resGroups, resProjects, resStudents]) =>
        Promise.all([resGroups.json(), resProjects.json(), resStudents.json()])
      ).then(([groups, projects, students]) => {
        
        if (groups.message !== "Group list is empty."){
          const professorEmail = JSON.parse(localStorage.getItem('userEmail')) // get the cached value of the professor's email
          const filteredGroupTableData = FilterDataByProfessor(groups, professorEmail) // keep only the data that contains the professor's email
          setTableData(filteredGroupTableData);
        }else{
          setTableData([])
        }

        // Filter projects
        if (projects.message !== "Project list is empty."){
          projects = projects.filter(project => project.status != "assigned")
          setProjects(projects)
        }
        if (students.message !== "Student list is empty."){
          setStudents(students)
        }
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
          if (students.length !== 0){
            return cell.getValue("members").map((value, index) => {
              let student = students.find((student) => {
                return student.orgdefinedid === value
              });
              
              if (typeof student !== "undefined"){
                let display = student.firstname + " " + student.lastname;
                return (
                <div>
                  <Chip sx = {{ marginBottom: "5px",}} color="success" label={display} />
                </div>
                )
              }
            });
          }
        }else{
          return <Chip sx = {{ marginBottom: "5px",}} color="error" label={"Empty Group"} />
        }
      }
    },
    {
      accessorKey: 'project',
      header: 'Project',
    },
    {
      accessorKey: 'notes',
      header: 'Notes'
    },
  ], [students]);

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
          console.log(response.ok)
          if (response.ok) {
            fetchData();
          }else if(response.status === 409){
            setMessage("The group already exists") // 5 seconds delay
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
    fetchData()
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
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
            console.log("HERE")
            fetchData();
            console.log(tableData)
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

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h2" align="center" fontWeight="fontWeightBold" sx={{ marginBottom: '0.5rem' }}>Groups</Typography>
      {message === "" ? "" : <Alert severity="warning">{message}</Alert>}
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
        projects={projects}
        students={students}
        groups ={tableData}
      />
    </Box>
  );
};

//Modal to create new Group
export const CreateNewGroupModal = ({ open, columns, onClose, onSubmit, fetchData, projects, students, groups}) => {

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  function validateFields(){
    if (values["group_id"] === "") {
      setError("Please Enter a Group Name")
      setTimeout(() => setError(""), 4000);
      return false
    }

    if (groups.length === 0){
      return true
    }

    console.log(groups)
    
    let group = groups.find((group) => group.group_id.toLowerCase() === values["group_id"].toLowerCase()) ;
    if (typeof group !== "undefined"){
      setError("The name already exists")
      setTimeout(() => setError(""), 4000);
      return false
    }
    
    return true
  }

  function getStyles(name, members, theme) {
    return {
      fontWeight:
        members.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const theme = useTheme();
  const [members, setMembers] = useState([])

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setMembers(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {}),
  );

  // log error 
  const [err, setError] = useState("")

  values["members"] = members
  const handleSubmit = (e) => {
    e.preventDefault()

    if ( validateFields() === false){
      return
    }

    const professorEmail = JSON.parse(localStorage.getItem('userEmail')) // get the cached value of the professor's email
    const newGroupInfo = { ...values, professorEmail: professorEmail } // add the professor's email as a new pair

    fetch("api/group", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newGroupInfo)
    })
      .then(response => {
        if (response.ok) {
          fetchData();
          Object.entries(values).map(([key,value]) =>{
            if (key === 'members'){
              values[key] = []
            } else {
              values[key] = ''
            }
          })
          setMembers([])
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
      {err === "" ? "" : <Alert severity="error">{err}</Alert>}

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
                return (
                  <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="demo-multiple-chip-label">Members</InputLabel>
                    <Select
                      labelId="demo-multiple-chip-label"
                      id="demo-multiple-chip"
                      multiple
                      value={members}
                      onChange={handleChange}
                      input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => {
                            let student = students.find((student) => student.orgdefinedid === value);
                            let display = student.orgdefinedid + " - " + student.firstname + " " + student.lastname;
                            return <Chip color="primary" key={value} label={display}/>
                      })}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >

                      {  students.length > 0 && students.map((student) => {
                        if (student.group === null){ 
                        return <MenuItem
                          key={student.orgdefinedid }
                          value={student.orgdefinedid}
                          style={getStyles(student.firstname, members, theme)}
                        >
                          {student.orgdefinedid + " - " + student.firstname + " " + student.lastname}
                        </MenuItem> }
              })}
                    </Select>
                  </FormControl>
                )
              }

              if (column.accessorKey === 'project') {
                return (
                  <FormControl>
                    <InputLabel id="project-label">Project</InputLabel>
                    <Select
                      labelId="project-label"
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