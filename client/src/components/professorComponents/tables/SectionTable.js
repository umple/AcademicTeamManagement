import {
  Delete,
  Edit,
  FileUpload as FileUploadIcon,
} from "@mui/icons-material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { ExportToCsv } from "export-to-csv";
import MaterialReactTable from "material-react-table";
import React, { useEffect, useMemo, useState } from "react";
import { csvOptions, handleExportData } from "../../../helpers/exportData";
import sectionService from "../../../services/sectionService";
import SectionForm from "../forms/SectionForm";
import { useStyles } from "./styles/SectionTableStyles";
import ConfirmDeletionModal from "../../common/ConfirmDeletionModal";

const SectionTable = () => {
    // name, term, year, notes
  const defaultColumns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "term",
        header: "Term",
      },
      {
        accessorKey: "year",
        header: "Year",
      },
      {
        accessorKey: "notes",
        header: "Notes",
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
  const [deletion, setOpenDeletion] = useState(false);
  const [row, setDeleteRow] = useState();
  const [editingRow, setEditingRow] = useState({});
  const [update, setUpdate] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const fetchSections = async () => {
    try {
      let sections = await sectionService.get();
      setTableData(sections.sections)
    } catch (error) {
      console.error("There was a problem with the network request:", error);
    }
  };

  useEffect(() => {
    fetchSections();
  }, [refreshTrigger]);

  const handleDeletion = async (row) => {
    try {
      await sectionService.delete(row.original._id);
      setOpenDeletion(false);
      fetchSections();
    } catch (error) {
      console.log(error);
    }
  };

  const csvExporter = new ExportToCsv(csvOptions("SectionsFromAcTeams-"));

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h2"
        align="center"
        fontWeight="fontWeightBold"
        sx={{ marginBottom: "0.5rem" }}
      >
        Sections
      </Typography>
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
                  setEditingRow(row.original);
                  setUpdate(true);
                  setCreateModalOpen(false);
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton
                color="error"
                name="deleteSection"
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
              name="create-new-section"
            >
              Create New Section
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
        <SectionForm
          columns={columns}
          open={createModalOpen}
          setCreateModalOpen={setCreateModalOpen}
          fetchSections={fetchSections}
          editingRow={editingRow}
          setEditingRow={setEditingRow}
          update={update}
          sections={tableData}
          setUpdate={setUpdate}
        />
      )}
      {deletion && (
        <ConfirmDeletionModal
          setOpen={setOpenDeletion}
          open={deletion}
          handleDeletion={handleDeletion}
          setRefreshTrigger={setRefreshTrigger}
          row={row}
          type={"section"}
        ></ConfirmDeletionModal>
      )}
    </Box>
  );
};

export default SectionTable;