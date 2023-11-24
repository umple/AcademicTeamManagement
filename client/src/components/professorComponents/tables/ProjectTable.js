import React, { useState, useMemo, useEffect } from "react";
import MaterialReactTable from "material-react-table";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
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
  FormLabel,
  FormGroup,
  Select,
  MenuItem,
  InputLabel,
  TextareaAutosize,
  Alert,
  Snackbar,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv";
import { Delete, Edit } from "@mui/icons-material";
import Chip from "@mui/material/Chip";
import { colorStatus } from "../../../helpers/statusColors";
import { csvOptions, handleExportData } from "../../../helpers/exportData";
import { FilterDataByProfessor } from "../../../helpers/FilterDataByProfessor";
import projectService from "../../../services/projectService";
import ConfirmDeletionModal from "../../common/ConfirmDeletionModal";
import ProjectForm from "../forms/ProjectForm";
import EditProjectForm from "../forms/EditProjectForm";
import ViewApplicationModal from "../ViewApplicationModal";
import { ROLES } from "../../../helpers/Roles";
import { getUserType } from "../../../helpers/UserType";
import { useTranslation } from 'react-i18next';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { MRT_Localization_FR } from 'material-react-table/locales/fr';

const ProjectTable = () => {

  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const getTableLocalization = (language) => {
    return language === 'fr' ? MRT_Localization_FR : MRT_Localization_EN;
  };

  const [tableLocalization, setTableLocalization] = useState(getTableLocalization(currentLanguage));

  useEffect(() => {
    setTableLocalization(getTableLocalization(currentLanguage));
  }, [currentLanguage]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "project",
        header: t("project.project-name"),
      },
      {
        accessorKey: "description",
        header: t("project.description"),
      },
      {
        accessorKey: "clientName",
        header: t("project.client-full-name"),
      },

      {
        accessorKey: "clientEmail",
        header: t("project.client-email"),
      },
      {
        accessorKey: "status",
        header: t("project.status"),
        //custom conditional format and styling
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor:
                cell.getValue() === "Available"
                  ? theme.palette.success.light
                  : cell.getValue() === "Underway"
                  ? theme.palette.warning.light
                  : cell.getValue() === "Completed"
                  ? theme.palette.secondary.main
                  : cell.getValue() === "Cancelled"
                  ? theme.palette.error.dark
                  : cell.getValue() === "Proposed"
                  ? "#ef6694"
                  : theme.palette.info.dark,
              borderRadius: "0.25rem",
              color: "#fff",
              maxWidth: "9ch",
              p: "0.25rem",
            })}
          >
            {cell.getValue()}
          </Box>
        ),
      },
      {
        accessorKey: "group",
        header: t("project.group"),
      },
      {
        accessorKey: "notes",
        header: t("project.notes"),
      },
    ],
    [currentLanguage]
  );

  const professorEmail = JSON.parse(localStorage.getItem("userEmail")); // get the cached value of the professor's email
  const [open, setOpen] = React.useState(false);
  const [currentApplication, setCurrentApplication]  = useState({})

  // Update the application details
  const handleOpen = async (group_id, project_id) => {
    const currApp = applications.filter(item => item.project === project_id && item.group_id === group_id)
    currApp && currApp.length > 0 && setCurrentApplication(currApp[0])
    setOpen(true)
  };
  const handleClose = () => setOpen(false);
  const csvExporter = new ExportToCsv(csvOptions("ProjectsFromAcTeams-"));

  // For the create profile modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteRow, setDeleteRow] = useState({});

  const [editModalOpen, setEditModalOpen] = useState(false);

  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const [editingRow, setEditingRow] = useState(null);

  const [tableData, setTableData] = useState([]);
  const [deletion, setOpenDeletion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [applications, setApplications] = useState([]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      let userType = "";
      let data = await projectService.get();

      await getUserType()
        .then((type) => {
          userType = type;
        })
        .catch((error) => {
          console.error(error);
        });
      if (data.projects) {
        if (userType === ROLES.ADMIN) {
          setTableData(data.projects); // show all data if user is an admin
        } else {
          const filteredProjectsTableData = FilterDataByProfessor(
            data.projects,
            professorEmail
          ); // keep only the data that contains the professor's email
          setTableData(filteredProjectsTableData);
        }
      } else {
        setTableData({})
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplications = () => {
    fetch("api/project/applications")
      .then((response) => response.json())
      .then((data) => {
        setApplications(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setApplications({});
        setTimeout(() => setIsLoading(false), 1000);
      });
  };

  const handleDeletion = async (row) => {
    try {
      await projectService.delete(row.original._id);
      setOpenDeletion(false);
      setRefreshTrigger((prevState) => !prevState);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      fetchProjects();
      fetchApplications();
    };
    fetchData();
  }, [refreshTrigger]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h2"
        align="center"
        fontWeight="fontWeightBold"
        sx={{ marginBottom: "0.5rem" }}
      >
        {t("project.project-name")}
      </Typography>

      <Snackbar
        open={showAlert}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success">Feedback Sent!</Alert>
      </Snackbar>

      <MaterialReactTable
        state={{ showProgressBars: isLoading }}
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
        renderDetailPanel={({ row, index }) => {
          return (
            <Grid container spacing={2}>
              <Grid item>
                <TableContainer component={Paper}>
                  <Table sx={{}} size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell>{t("project.project-applications")}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t("common.Group")}</TableCell>
                        <TableCell>{t("project.status")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {applications.map((application) => {
                        if (row.original.project !== application.project) {
                          return;
                        }
                        return (
                          <TableRow key={row.id}>
                            <TableCell>{application.group_id}</TableCell>
                            <TableCell align="right">
                              <Chip
                                label={application.status}
                                color={colorStatus(application.status)}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => handleOpen(application.group_id, row.original.project)}
                              >
                                {t("project.review-application")}
                              </Button>
                              {open && 
                                <ViewApplicationModal
                                fetchApplications={fetchApplications}
                                setShowAlert={setShowAlert}
                                data={currentApplication}
                                open={open}
                                onClose={handleClose}
                                onSubmit={() => setOpen(false)}
                              />
                              }
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          );
        }}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Tooltip arrow placement="left" title={t("common.Edit")}>
              <IconButton
                onClick={() => {
                  setEditModalOpen(true);
                  setEditingRow(row);
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            {/* onClick={() => handleDeleteRow(row)}> */}
            <Tooltip arrow placement="right" title={t("common.Delete")}>
              <IconButton
                color="error"
                name="deleteProject"
                onClick={() => {
                  setOpenDeletion(true);
                  setDeleteRow(row);
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
              name="create-new-project"
              onClick={() => setCreateModalOpen(true)}
              variant="contained"
            >
              {t("project.create-project")}
            </Button>
            <Button
              color="primary"
              //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
              onClick={() => handleExportData(tableData, columns, csvExporter)}
              startIcon={<FileDownloadIcon />}
              variant="contained"
            >
              {t("common.export-data")}
            </Button>
          </Box>
        )}
      />
      {editingRow && (
        <EditProjectForm
          columns={columns}
          open={editModalOpen}
          projects={tableData}
          setEditModalOpen={setEditModalOpen}
          setEditingRow={setEditingRow}
          projectData={editingRow}
          setRefreshTrigger={setRefreshTrigger}
        />
      )}

      <ProjectForm
        columns={columns}
        open={createModalOpen}
        projects={tableData}
        setCreateModalOpen={setCreateModalOpen}
        setRefreshTrigger={setRefreshTrigger}
      />
      {deletion && (
        <ConfirmDeletionModal
          setOpen={setOpenDeletion}
          open={deletion}
          handleDeletion={handleDeletion}
          row={deleteRow}
          type={"project"}
        ></ConfirmDeletionModal>
      )}
    </Box>
  );
};

export default ProjectTable;
