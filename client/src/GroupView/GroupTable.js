import React, { useCallback, useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import MaterialReactTable from 'material-react-table';
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
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ExportToCsv } from 'export-to-csv'; //or use your library of choice here
import { Delete, Edit } from '@mui/icons-material';

// Mock data for table
const data = [
  {
    group_id: 1,
    members: ['Jack Smith','Ronny Welsh','Jenna Sunn','Mark Boudreau','Emilie Lachance'],
    interest: 'Project D, E, and G',
    project: 'not assigned',
    notes: '',
  },
  {
    group_id: 2,
    members: ['Bob Anderson','Julina Robs','Maria Inkepen'],
    interest: '',
    project: 'Project G',
    notes: 'Ideally four students',
  },
];



const ProjectTable = () => {
  // Columns for table
  const columns = useMemo(
    () => [
          {
            accessorKey: 'group_id',
            header: 'Group',
          },
          {
            accessorKey: 'members',
            header: 'Members',
            Cell: ({ cell }) => (
              cell.getValue().map((i) => <tr>{i}</tr>)
            ),
          },
          {
            accessorKey: 'project',
            header: 'Current Project',
          },
          {
            accessorKey: 'interest',
            header: 'Interested projects',
          },
          {
            accessorKey: 'notes',
            header: 'Notes'
          },
        ],
    [],
  );

  // For the create profile modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState(() => data);
  const [validationErrors, setValidationErrors] = useState({});

  const handleCreateNewRow = (values) => {
    tableData.push(values);
    setTableData([...tableData]);
    console.log(tableData)
    console.log(columns)
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      tableData[row.index] = values;
      setTableData([...tableData]);
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
        !window.confirm(`Are you sure you want to delete ${row.getValue('firstName')}`)
      ) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render
      tableData.splice(row.index, 1);
      setTableData([...tableData]);
    },
    [tableData],
  );

  // For exporting the table data
  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns.map((c) => c.header),
  };

  const csvExporter = new ExportToCsv(csvOptions);

  const handleExportData = () => {
    csvExporter.generateCsv(data);
  };
   
  return(
  <Box sx={{ p: 2 }}>
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
            //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
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
      />
  </Box>
  );
};

//Modal to create new Group
export const CreateNewGroupModal = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      if (column.accessorKey === 'project') {
        acc[column.accessorKey ?? ''] = 'not assigned';
      } else {
        acc[column.accessorKey ?? ''] = '';
      }
      return acc;
    }, {}),
  );

  const {
    control,
    handleSubmit: handleValidatedSubmit,
    formState: { errors },
  } = useForm();

  const handleSubmit = () => {
    onSubmit(values);
    onClose();
  };

  return (
    <form onSubmit={handleValidatedSubmit(handleSubmit)}>
      <Dialog open={open}>
        <DialogTitle textAlign="center">Create New Group</DialogTitle>
        <DialogContent>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
              marginTop: '0.5rem',
            }}
          >
            {columns.map((column) => {
              if (column.accessorKey === 'project' || column.accessorKey === 'interest') {
                return null;
              }
              return (
                <Controller
                  key={column.accessorKey}
                  name={column.accessorKey}
                  control={control}
                  defaultValue={column.accessorKey === 'project' ? 'not assigned' : ''}
                  rules={{
                    required: column.accessorKey !== 'notes' ? `${column.header} is required.` : false,
                  }}
                  render={({ field }) => (
                    <TextField
                      label={
                        `${column.header}${column.accessorKey !== 'notes' ? ' *' : ''}`
                      }
                      error={!!errors[column.accessorKey]}
                      helperText={errors[column.accessorKey]?.message}
                      {...field}
                    />
                  )}
                />
              );
            })}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="secondary" onClick={handleValidatedSubmit(handleSubmit)} variant="contained" type="submit">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default ProjectTable;
