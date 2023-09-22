import React, { useCallback, useState, useEffect, useMemo } from "react";
import { CreateNewGroupModal } from "./CreateNewGroupModal";
import MaterialReactTable from "material-react-table";
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
  Select,
  MenuItem,
  cellValueMap,
  InputLabel,
  OutlinedInput,
  Alert,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv"; //or use your library of choice here
import { Delete, Edit } from "@mui/icons-material";
import { FormControl } from "@material-ui/core";
import Chip from "@mui/material/Chip";
import { Theme, useTheme } from "@mui/material/styles";
import groupsService from "../services/groupsService";
import { FilterDataByProfessor } from "../Utils/FilterDataByValue";

const GroupTable = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [projects, setProjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchGroups();
    fetchData();
  }, []);

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

  const fetchGroups = async () => {
    try {
      const response = await groupsService.get();
      const professorEmail = JSON.parse(localStorage.getItem('userEmail')) // get the cached value of the professor's email
      const filteredGroupTableData = FilterDataByProfessor(response, professorEmail) // keep only the data that contains the professor's email
      setTableData(filteredGroupTableData);
    } catch (error) {
      setTableData([]);
    }
  };

  const fetchData = async () => {
    try {
      const [resProjects, resStudents] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/students"),
      ]);
      const [projectsData, studentsData] = await Promise.all([
        resProjects.json(),
        resStudents.json(),
      ]);

      if (projectsData.message !== "Project list is empty.") {
        const filteredProjects = projectsData.filter(
          (project) => project.status !== "assigned"
        );
        setProjects(filteredProjects);
      }

      if (studentsData.message !== "Student list is empty.") {
        setStudents(studentsData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddRow = useCallback(async (newRowData) => {
    try {
      let response = await groupsService.post(newRowData);
      if (response == 200) {
        fetchData();
      } else if (response === 409) {
        setMessage("The group already exists");
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      try {
        const response = await groupsService.put(row.original._id, values);

        if (response === 200) {
          fetchData();
        } else if (response === 409) {
          setMessage("The group already exists");
        } else {
          console.error("Error updating row");
        }
      } catch (error) {
        console.error(error);
      }
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
          `Are you sure you want to delete group: ${row.getValue("group_id")}`
        )
      ) {
        return;
      }

      try {
        const response = groupsService.delete(row.original._id);
        if (response === 200) {
          fetchData();
        } else if (response === 409) {
          setMessage("The group already exists");
        } else {
          console.error("Error updating row");
        }
      } catch (error) {
        console.error(error);
      }
    },
    [tableData]
  );

  // For exporting the table data
  const csvOptions = {
    filename: "GroupsFromAcTeams-" + getDate(),
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

  function getDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

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
        onAddRow={handleAddRow}
        fetchData={fetchData}
        projects={projects}
        students={students}
        groups={tableData}
      />
    </Box>
  );
};

export default GroupTable;
