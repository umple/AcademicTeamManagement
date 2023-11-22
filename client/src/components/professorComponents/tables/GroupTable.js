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
import { useTranslation } from 'react-i18next';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { MRT_Localization_FR } from 'material-react-table/locales/fr';
import { getUserType } from "../../../helpers/UserType"
import { DEFAULT_PAGE_SIZE } from "../../../helpers/Constants"
import { useLocation } from 'react-router-dom';


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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const getTableLocalization = (language) => {
    return language === 'fr' ? MRT_Localization_FR : MRT_Localization_EN;
  };

  const [tableLocalization, setTableLocalization] = useState(getTableLocalization(currentLanguage));

  useEffect(() => {
    setTableLocalization(getTableLocalization(currentLanguage));
  }, [currentLanguage]);

  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [showAllRows, setShowAllRows] = useState(false);

  // Expand the table to include rows for all table data
  const handleExpandTable = () => {
    setShowAllRows(true)
    setPageSize(tableData.length)
  };

  // handle scrolling to the row selected
  const scrollToRow = useCallback((rowId) => {
    const targetRow = document.getElementById(`row-${rowId}`);
    if (targetRow) {
      targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [tableData]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const groupId = params.get('group_id');

    if (groupId && tableData.length > 0) {
      scrollToRow(groupId);
    }
  }, [location.search, tableData]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "group_id",
        header: t('common.Group'),
      },
      {
        accessorKey: "members",
        header: t('common.Members'),
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
        header: t('common.Project'),
      },
      {
        accessorKey: "notes",
        header: t('section.notes'),
      },
    ],
    [students,currentLanguage]
  );

  
  const fetchProjects = async () => {
    try {
      const projects = await projectService.get();

      if (projects.projects && projects.message !== "Project list is empty.") {
        const filteredProjects = projects.projects.filter(
          (project) => project.status === "Available"
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
        students.students && setStudents(students.students);
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

      if (groups.groups && groups.message !== "Group list is empty.") {
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
        {t('header.navbar.groups')}
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
        data={(showAllRows && tableData) ? tableData : tableData.slice(0, pageSize)}
        enableColumnOrdering
        enableColumnResizing
        columnResizeMode="onChange" //default is "onEnd"
        defaultColumn={{
          minSize: 100,
          size: 150, //default size is usually 180
        }}
        enableEditing
        initialState={{ showColumnFilters: false, density: "compact"}}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "1rem" }} id={`row-${row.original.group_id}`}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton
                onClick={(e) => {
                  setEditingRow(row);
                  setEditModalOpen(true);
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
              {t('group-table.create-group')}
            </Button>
            <Button
              color="primary"
              onClick={() => handleExportData(tableData, columns, csvExporter)}
              startIcon={<FileDownloadIcon />}
              variant="contained"
            >
              {t('common.export-data')}
            </Button>
          </Box>
        )}
      />

      <GroupForm
        columns={columns}
        open={createModalOpen}
        setCreateModalOpen={setCreateModalOpen}
        fetchData={fetchData}
        projects={projects}
        students={students}
        groups={tableData}
      />

      {pageSize === DEFAULT_PAGE_SIZE 
        && pageSize < tableData.length
        && (
        <Button 
          sx={{m: 2}}
          style={{ position: 'absolute', right: '1rem' }}
          color="secondary"
          variant="contained"
          onClick={handleExpandTable}>
          Display all {tableData.length} rows
        </Button>
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

      {editingRow && (
        <EditGroupModal
          columns={columns}
          open={editModalOpen}
          setEditModalOpen={setEditModalOpen}
          setEditingRow={setEditingRow}
          setRefreshTrigger={setRefreshTrigger}
          fetchData={fetchData}
          groupData={editingRow}
          projects={[...projects, editingRow.original]}
          students={students}
          groups={tableData}
        />
      )}
    </Box>
  );
};

export default GroupTable;
