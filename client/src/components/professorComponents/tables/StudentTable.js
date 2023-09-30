import { Paper } from "@material-ui/core";
import { Delete, Edit, FileUpload as FileUploadIcon } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
  Box,
  Button,
  Dialog, DialogTitle,
  IconButton, Tooltip,
  Typography
} from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { ExportToCsv } from "export-to-csv";
import MaterialReactTable from "material-react-table";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FilterDataByProfessor } from "../../../helpers/FilterDataByValue";
import { getDate } from "../../../helpers/dateHelper";
import ImportStudents from "../ImportStudents";
import { CreateNewStudentModal } from "../forms/CreateNewStudentModal";
import { useStyles } from "./styles/StudentTableStyles";

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
        accessorKey: "final grade",
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
  const [importSuccess, setImportSuccess] = useState(false);

  function handleImportSuccess(success) {
    setImportSuccess(success);
    if (success) {
      setTimeout(() => setImportSuccess(false), 4000); // 5 seconds delay
    }
  }

  const fetchStudents = async () => {
    fetch("/api/students")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("There is no Students");
        }
      })
      .then((data) => {
        const professorEmail = JSON.parse(localStorage.getItem("userEmail")); // get the cached value of the professor's email
        const filteredStudentsTableData = FilterDataByProfessor(
          data,
          professorEmail
        ); // keep only the data that contains the professor's email
        setTableData(filteredStudentsTableData);
      })
      .catch((error) => {
        console.error("There was a problem with the network request:", error);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddRow = useCallback((newRowData) => {
    fetch("api/student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRowData),
    })
      .then((response) => response.json())
      .then((data) => {
        fetchStudents();
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleCreateNewRow = (values) => {};

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      fetch(`api/student/update/${row.original._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((response) => {
          if (response.ok) {
            fetchStudents();
          } else {
            console.error("Error deleting row");
          }
        })
        .catch((error) => {
          console.error(error);
        });
      exitEditingMode();
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  // To delete the row
  const handleDeleteRow = useCallback(
    (row) => {
      if (
        !window.confirm(
          `Are you sure you want to delete ${row.getValue("username")}`
        )
      ) {
        return;
      }
      fetch(`api/student/delete/${row.original._id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            fetchStudents();
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

  const csvOptions = {
    filename: "StudentsFromAcTeams-" + getDate(),
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: true,
  };

  const csvExporter = new ExportToCsv(csvOptions);

  const handleExportData = () => {
    // clean up and organize data to be exported
    const keyToRemove = "_id";
    const updatedJsonList = tableData.map((jsonObj) => {
      let updatedJsonObject = jsonObj;
      // remove the _id as that should not be in the json
      if (keyToRemove in jsonObj) {
        const { [keyToRemove]: deletedKey, ...rest } = jsonObj; // use destructuring to remove the key
        updatedJsonObject = rest; // return the updated JSON object without the deleted key
      }

      // sort the keys as they appear in the columns
      const orderedKeys = columns.map((key) => key.accessorKey);
      updatedJsonObject = Object.keys(updatedJsonObject)
        .sort((a, b) => orderedKeys.indexOf(a) - orderedKeys.indexOf(b)) // sort keys in the order of the updated keys
        .reduce((acc, key) => ({ ...acc, [key]: updatedJsonObject[key] }), {}); // create a new object with sorted keys

      // replace the accessor key by the header
      for (let i = 0; i < columns.length; i++) {
        const { accessorKey, header } = columns[i];
        if (accessorKey in updatedJsonObject) {
          const { [accessorKey]: renamedKey, ...rest } = updatedJsonObject; // use destructuring to rename the key
          updatedJsonObject = { ...rest, [header]: renamedKey }; // update the JSON object with the renamed key
        }
      }

      return updatedJsonObject; // return the original JSON object if the key is not found
    });

    csvExporter.generateCsv(updatedJsonList);
  };

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
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
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
 

export default StudentTable;
