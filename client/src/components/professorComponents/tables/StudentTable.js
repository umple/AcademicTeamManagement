import { Paper } from "@material-ui/core";
import {
  Delete,
  Edit,
  FileUpload as FileUploadIcon,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { ExportToCsv } from "export-to-csv";
import MaterialReactTable from "material-react-table";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FilterDataByProfessor } from "../../../helpers/FilterDataByProfessor";
import { csvOptions, handleExportData } from "../../../helpers/exportData";
import studentService from "../../../services/studentService";
import ImportStudents from "../ImportStudents";
import StudentForm from "../forms/StudentForm";
import { useStyles } from "./styles/StudentTableStyles";
import ConfirmDeletionModal from "../../common/ConfirmDeletionModal";
import { ROLES } from "../../../helpers/Roles";
import { getUserType } from "../../../helpers/UserType"
import EditStudentForm from "../forms/EditStudentModal";

const StudentTable = () => {
  const defaultColumns = useMemo(
    () => [
      {
        accessorKey: "orgdefinedid",
        header: "orgDefinedId",
      },
      {
        accessorKey: "username",
        header: "Username",
      },
      {
        accessorKey: "lastname",
        header: "Last Name",
      },
      {
        accessorKey: "firstname",
        header: "First Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "sections",
        header: "Section",
      },
      {
        accessorKey: "finalGrade",
        header: "Final Grade",
      },
    ],
    []
  );
  // For the create profile modal
  const [columns] = useState(defaultColumns);
  const classes = useStyles();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [deletion, setOpenDeletion] = useState(false);
  const [row, setDeleteRow] = useState();
  const [editingRow, setEditingRow] = useState(null);
  const [update, setUpdate] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  function handleImportSuccess(success) {
    setImportSuccess(success);
    if (success) {
      setTimeout(() => setImportSuccess(false), 4000); // 5 seconds delay
    }
  }

  const fetchStudents = async () => {
    try {
      let userType = ""
      let students = await studentService.get();
      
      await getUserType()
      .then((type) => {
        userType = type
      })
      .catch((error) => {
        console.error(error);
      });

      if (students.students) {
        if (userType == ROLES.ADMIN) {
          setTableData(students.students); // show all data if user is an admin
        } else {
          const professorEmail = JSON.parse(localStorage.getItem("userEmail")); // get the cached value of the professor's email
          const filteredStudentsTableData = FilterDataByProfessor(
            students.students,
            professorEmail
          ); // keep only the data that contains the professor's email
          setTableData(filteredStudentsTableData);
        }
      }

    } catch (error) {
      console.error("There was a problem with the network request:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [refreshTrigger]);

  const handleDeletion = async (row) => {
    try {
      await studentService.delete(row.original._id);
      setOpenDeletion(false);
      fetchStudents();
    } catch (error) {
      console.log(error);
    }
  };

  const csvExporter = new ExportToCsv(csvOptions("StudentsFromAcTeams-"));

  const [isImportModalOpen, setImportModalOpen] = useState(false);

  const closeModal = () => {
    setImportModalOpen(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h2"
        align="center"
        fontWeight="fontWeightBold"
        sx={{ marginBottom: "0.5rem" }}
      >
        Students
      </Typography>
      {importSuccess && (
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          success alert — <strong>successfully imported students!</strong>
        </Alert>
      )}
      <MaterialReactTable
        displayColumnDefOptions={{
          "mrt-row-actions": {
            muiTableHeadCellProps: {
              align: "center",
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
        initialState={{ showColumnFilters: false, density: "compact" }}
        // onEditingRowSave={handleSaveRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton
                onClick={() => {
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
                name="deleteStudent"
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
            sx={{
              display: "flex",
              gap: "1rem",
              p: "0.5rem",
              flexDirection: "row",
            }}
          >
            <Button
              color="success"
              onClick={() => setCreateModalOpen(true)}
              variant="contained"
              name="create-new-student"
            >
              Create New Student
            </Button>
            <Button
              color="primary"
              onClick={() => handleExportData(tableData, columns, csvExporter)}
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

            <Dialog
              PaperComponent={Paper}
              PaperProps={{ className: classes.dialogPaper }}
              scroll="paper"
              open={isImportModalOpen}
              onClose={() => setImportModalOpen(false)}
            >
              <DialogTitle className={classes.dialogTitle}>
                Import Students{" "}
                <IconButton
                  className={classes.closeButton}
                  onClick={() => setImportModalOpen(false)}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>

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

      {editingRow && (
        <EditStudentForm
          columns={columns}
          open={editModalOpen}
          setEditModalOpen={setEditModalOpen}
          setEditingRow={setEditingRow}
          studentData={editingRow}
          setRefreshTrigger={setRefreshTrigger}
          students={tableData}
        />
      )}

      <StudentForm
        columns={columns}
        open={createModalOpen}
        setCreateModalOpen={setCreateModalOpen}
        fetchStudents={fetchStudents}
        students={tableData}
      />

      {deletion && (
        <ConfirmDeletionModal
          setOpen={setOpenDeletion}
          open={deletion}
          handleDeletion={handleDeletion}
          setRefreshTrigger={setRefreshTrigger}
          row={row}
          type={"student"}
        ></ConfirmDeletionModal>
      )}
    </Box>
  );
};

export default StudentTable;
