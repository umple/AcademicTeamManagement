import React, { useState, useMemo, useEffect } from 'react';
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

const StudentGroupTable = () => {

  // For the create profile modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
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

  const fetchGroups = () => {
    fetch("/api/groups")
      .then(response => response.json())
      .then(data => {
        setTableData(data)
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchGroups();
  }, []);



  const handleCreateNewRow = (values) => {
    tableData.push(values);
    setTableData([...tableData]);
    console.log(tableData)
    console.log(columns)
  };


  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h2" align="center" fontWeight="fontWeightBold" sx={{ marginBottom: '0.5rem' }}>Student Groups</Typography>
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
        renderRowActions={({ row, table }) => {
          const handleJoinClick = async (row) => {
            fetch('api/add/group/member', {
              method: 'POST', // or 'PUT', 'DELETE', etc.
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(row)
            })
              .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.json();
              })
              .then(data => {
                 console.log(data)
              })
              .catch(error => {
                console.error('Error:', error);
              });
          };

          return (
            <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
              <Button onClick={() => handleJoinClick(row)}>Join</Button>
            </Box>
          );
        }}
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
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {}),
  );

  const handleSubmit = () => {
    //put your validation logic here
    onSubmit(values);
    onClose();
  };

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
            }}
          >
            {columns.map((column) => (
              <TextField
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
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

export default StudentGroupTable;
