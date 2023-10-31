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
import ConfirmDeletionModal from "../../common/ConfirmDeletionModal";
import EditGroupModal from "../forms/EditGroupModal";
import { ROLES } from "../../../helpers/Roles";
import { getUserType } from "../../../helpers/UserType"

const GroupTable = () => {
  // For the create profile modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [update, setUpdate] = useState(false);


  const [tableData, setTableData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [deletion, setDeletion] = useState(false);
  const [row, setDeleteRow] = useState();
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [editingRow, setEditingRow] = useState({});

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

  
  const fetchProjects = async () => {
    try {
      const projects = await projectService.get();

      if (projects.message !== "Project list is empty.") {
        const filteredProjects = projects.projects.filter(
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
        setStudents(students.students);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchGroups = async () => {
    try {
      let userType = ""
      const groups = await groupService.get();

      await getUserType()
      .then((type) => {
        userType = type
      })
      .catch((error) => {
        console.error(error);
      });

      if (groups.message !== "Group list is empty.") {
        if (userType === ROLES.ADMIN) {
          setTableData(groups.groups); // show all data for admin users
        } else {
          const professorEmail = JSON.parse(localStorage.getItem("userEmail"));
          const filteredGroupTableData = FilterDataByProfessor(
            groups.groups,
            professorEmail
          );
          setTableData(filteredGroupTableData);
        }
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

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const handleDeletion = async (row) => {
    try {
      await groupService.delete(row.original._id);
      setDeletion(false);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

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
                onClick={(e) => {
                  setEditingRow(row.original);
                  setCreateModalOpen(false)
                  setUpdate(true);
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton
                color="error"
                name="deleteGroup"
                onClick={() => {
                  setDeleteRow(row);
                  setDeletion(true);
                }}
              >
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
              name="create-new-group"
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

      {(update || createModalOpen) && (
        <GroupForm
          columns={columns}
          open={createModalOpen}
          fetchData={fetchData}
          projects={projects}
          students={students}
          groups={tableData}
          setCreateModalOpen={setCreateModalOpen}
          update={update}
          setUpdate={setUpdate}
          setEditingRow={setEditingRow}
          editingRow={editingRow}
        />
      )}

      {deletion && (
        <ConfirmDeletionModal
          setOpen={setDeletion}
          open={deletion}
          handleDeletion={handleDeletion}
          setRefreshTrigger={setRefreshTrigger}
          row={row}
          type={"group"}
        ></ConfirmDeletionModal>
      )}
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

export default GroupTable;
