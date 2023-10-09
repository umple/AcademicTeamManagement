import { FormControl } from "@material-ui/core";
import { Delete, Edit } from "@mui/icons-material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
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
  Typography,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";
import { ExportToCsv } from "export-to-csv"; //or use your library of choice here
import MaterialReactTable from "material-react-table";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FilterDataByProfessor } from "../../../helpers/FilterDataByProfessor";
import { csvOptions, handleExportData } from "../../../helpers/exportData";
import groupService from "../../../services/groupService";
import projectService from "../../../services/projectService";
import studentService from "../../../services/studentService";
import GroupForm from "../forms/GroupForm";

const GroupTable = () => {
  // For the create profile modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [projects, setProjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");

  const columns = useMemo(
    () => [
      {
        accessorKey: "group_id",
        header: "Group",
      },
      {
        accessorKey: "members",
        header: "Members",
        Cell: ({ cell }) => {
          if (
            Array.isArray(cell.getValue("members")) &&
            cell.getValue("members").length > 0
          ) {
            if (students.length !== 0) {
              return cell.getValue("members").map((value, index) => {
                let student = students.find((student) => {
                  return student.orgdefinedid === value;
                });

                if (typeof student !== "undefined") {
                  let display = student.firstname + " " + student.lastname;
                  return (
                    <div>
                      <Chip
                        sx={{ marginBottom: "5px" }}
                        color="success"
                        label={display}
                      />
                    </div>
                  );
                }
              });
            }
          } else {
            return (
              <Chip
                sx={{ marginBottom: "5px" }}
                color="error"
                label={"Empty Group"}
              />
            );
          }
        },
      },
      {
        accessorKey: "project",
        header: "Project",
      },
      {
        accessorKey: "notes",
        header: "Notes",
      },
    ],
    [students]
  );

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(false);
  const [editingValues, setEditingValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );

  const fetchProjects = async () => {
    try {
      const projects = await projectService.get();

      if (projects.message !== "Project list is empty.") {
        const filteredProjects = projects.filter(
          (project) => project.status !== "assigned"
        );
        setProjects(filteredProjects);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const students = await studentService.get();

      if (students.message !== "Student list is empty.") {
        setStudents(students);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchGroups = async () => {
    try {
      const groups = await groupService.get();

      if (groups.message !== "Group list is empty.") {
        const professorEmail = JSON.parse(localStorage.getItem("userEmail"));
        const filteredGroupTableData = FilterDataByProfessor(
          groups,
          professorEmail
        );
        setTableData(filteredGroupTableData);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const fetchData = async () => {
    await fetchProjects();
    await fetchStudents();
    await fetchGroups();
  };

  useEffect(()=>{
    fetchData()
  },[])

  const handleSaveRowEdits = async (row, values) => {
    //if (!Object.keys(validationErrors).length) {
    console.log(row);
    console.log(values);
    //THIS LINE IS A TEMPORARY FIX AND THIS FIELD SHOULD STORE A GROUP ID.
    values["members"] = values["members"].join();
    const professorEmail = JSON.parse(localStorage.getItem("userEmail"));
    values["professorEmail"] = professorEmail;
    fetch(`api/group/update/${row.original._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (response.ok) {
          fetchData();
        } else {
          console.error("Error editing row");
        }
      })
      .catch((error) => {
        console.error(error);
      });
    //}
  };

  // To delete the row
  const handleDeleteRow = useCallback(
    (row) => {
      if (
        !window.confirm(
          `Are you sure you want to delete group: ${row.getValue("group_id")}`
        )
      ) {
        return;
      }
      fetch(`api/group/delete/${row.original._id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            fetchData();
          } else {
            console.error("Error deleting row");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    [tableData]
  );

  const csvExporter = new ExportToCsv(csvOptions("GroupsFromAcTeams-"));

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h2"
        align="center"
        fontWeight="fontWeightBold"
        sx={{ marginBottom: "0.5rem" }}
      >
        Groups
      </Typography>
      {message === "" ? "" : <Alert severity="warning">{message}</Alert>}
      <MaterialReactTable
        displayColumnDefOptions={{
          "mrt-row-actions": {
            muiTableHeadCellProps: {
              align: "center",
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
        initialState={{ showColumnFilters: false, density: "compact" }}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton
                onClick={() => {
                  setEditingRow(row);
                  var temp = {};
                  {
                    columns.map((column) => {
                      temp[column.accessorKey] = row.getValue(
                        column.accessorKey
                      );
                    });
                  }
                  setEditingValues(temp);
                  setEditModalOpen(true);
                }}
              >
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
          <Box
            sx={{ display: "flex", gap: "1rem", p: "0.5rem", flexWrap: "wrap" }}
          >
            <Button
              color="success"
              onClick={() => setCreateModalOpen(true)}
              variant="contained"
            >
              Create New Group
            </Button>
            <Button
              color="primary"
              onClick={() => handleExportData(tableData, columns, csvExporter)}
              startIcon={<FileDownloadIcon />}
              variant="contained"
            >
              Export All Data
            </Button>
          </Box>
        )}
      />
      <GroupForm
        columns={columns}
        open={createModalOpen}
        fetchData={fetchData}
        projects={projects}
        students={students}
        groups={tableData}
        setCreateModalOpen={setCreateModalOpen}
      />
      {/* <EditGroupModal
        columns={columns}
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleSaveRowEdits}
        fetchData={fetchData}
        projects={projects}
        students={students}
        editingRow={editingRow}
        values={editingValues}
        setValues={setEditingValues}
        groups={tableData}
      /> */}
    </Box>
  );
};

//Modal to create new Group
export const EditGroupModal = ({
  open,
  columns,
  onClose,
  onSubmit,
  fetchData,
  projects,
  students,
  groups,
  editingRow,
  values,
  setValues,
}) => {
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

  function validateFields() {
    if (values["group_id"] === "") {
      setError("Please Enter a Group Name");
      setTimeout(() => setError(""), 4000);
      return false;
    }

    if (groups.length === 0) {
      return true;
    }

    let group = groups.find(
      (group) =>
        group.group_id.toLowerCase() === values["group_id"].toLowerCase()
    );
    if (group === undefined) {
      return true;
    }

    if (group._id !== editingRow.original._id) {
      setError("The group name already exists");
      setTimeout(() => setError(""), 4000);
      return false;
    }

    return true;
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
  const [members, setMembers] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setMembers(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  // log error
  const [err, setError] = useState("");

  values["members"] = members;
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateFields() === false) {
      return;
    }

    const professorEmail = JSON.parse(localStorage.getItem("userEmail")); // get the cached value of the professor's email
    const newGroupInfo = { ...values, professorEmail: professorEmail }; // add the professor's email as a new pair

    onSubmit(editingRow, values);
    onClose();
  };

  return (
    <Dialog open={open}>
      {err === "" ? "" : <Alert severity="error">{err}</Alert>}

      <DialogTitle textAlign="center">Edit Group</DialogTitle>
      <form onSubmit={(e) => e.preventDefault()}>
        <DialogContent>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            {columns.map((column) => {
              if (column.accessorKey === "members") {
                return (
                  <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="demo-multiple-chip-label">
                      Members
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-chip-label"
                      id="demo-multiple-chip"
                      multiple
                      value={members}
                      onChange={handleChange}
                      input={
                        <OutlinedInput id="select-multiple-chip" label="Chip" />
                      }
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => {
                            let student = students.find(
                              (student) => student.orgdefinedid === value
                            );
                            let display =
                              student.orgdefinedid +
                              " - " +
                              student.firstname +
                              " " +
                              student.lastname;
                            return (
                              <Chip
                                color="primary"
                                key={value}
                                label={display}
                              />
                            );
                          })}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {students.length > 0 &&
                        students.map((student) => {
                          if (student.group === null) {
                            return (
                              <MenuItem
                                key={student.orgdefinedid}
                                value={student.orgdefinedid}
                                style={getStyles(
                                  student.firstname,
                                  members,
                                  theme
                                )}
                              >
                                {student.orgdefinedid +
                                  " - " +
                                  student.firstname +
                                  " " +
                                  student.lastname}
                              </MenuItem>
                            );
                          }
                        })}
                    </Select>
                  </FormControl>
                );
              }

              if (column.accessorKey === "project") {
                return (
                  <FormControl>
                    <InputLabel id="project-label">Project</InputLabel>
                    <Select
                      labelId="project-label"
                      key={column.accessorKey}
                      name={column.accessorKey}
                      value={values[column.accessorKey]}
                      onChange={(e) => {
                        setValues({
                          ...values,
                          [e.target.name]: e.target.value,
                        });
                      }}
                    >
                      {projects.map((option) => (
                        <MenuItem key={option.project} value={option.project}>
                          {option.project}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                );
              }

              return (
                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  value={values[column.accessorKey]}
                  onChange={(e) => {
                    setValues({ ...values, [e.target.name]: e.target.value });
                  }}
                />
              );
            })}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: "1.25rem" }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="secondary" onClick={handleSubmit} variant="contained">
            Edit Group
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default GroupTable;
