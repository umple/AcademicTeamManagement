import React, { useState, useMemo } from 'react';
import MaterialReactTable from 'material-react-table';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography
} from '@mui/material';

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
   
  return(
  <Box sx={{ p: 2 }}>
    <Typography variant="h2" align="center" fontWeight="fontWeightBold" sx={{marginBottom:'0.5rem'}}>Student Groups</Typography>
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
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
            <Button>Join</Button>
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
  const [values, setValues] = useState(() => {
    const initialValues = columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {});

    initialValues['project'] = 'not assigned';
    return initialValues;
  });

  const handleSubmit = () => {
    onSubmit(values);
    onClose();
  };


  const formColumns = columns.filter(
    (column) => !['interest', 'project'].includes(column.accessorKey)
  );

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Group</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
              marginTop: '0.5rem',
            }}
          >
            {formColumns.map((column) => (
              <TextField
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                required={column.accessorKey !== 'notes'}
              />
            ))}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectTable;
