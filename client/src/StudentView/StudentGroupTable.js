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
  Typography,
  Alert,
  Snackbar
} from '@mui/material';

const StudentGroupTable = () => {

  // For the create profile modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState({});
  const [group, setGroup] = useState({});
  const [isCurrentUserInGroup, setisCurrentUserInGroup] = useState(false)
  const [showAlert, setShowAlert] = useState(false);
  const [isRowDisabled, setisRowDisabled] = useState(false);
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

  const fetchCurrentUserGroup = () => {
    fetch("/api/retrieve/curr/user/group  ")
      .then((response) => {
        if (!response.ok) {
          setisCurrentUserInGroup(false)
        } else {
          return response.json()
        }
      })
      .then((data) => {
        setisCurrentUserInGroup(true)
        setGroup(data)
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    fetchGroups();
    fetchCurrentUserGroup();
  }, []);

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
          const joinGroup = () => {
            fetch('api/add/group/member', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(row),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error('Something happened');
                }
                return response.json();
              })
              .then((data) => {
                fetchGroups()
                fetchCurrentUserGroup()
                setShowAlert(false)
              })
              .catch((error) => {
                console.error('Error:', error);
              });
          };

          const handleAlertClose = (event, reason) => {
            if (reason === 'clickaway') {
              return;
            }
            setShowAlert(false);
          };

          const handleJoinClick = async () => {
              joinGroup()
          };

          return (
            <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
              <Button onClick={() => handleJoinClick()} disabled={typeof group !== 'undefined' && row.original._id === group._id}>Join</Button>
              <Snackbar open={showAlert} onClose={handleAlertClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert
                  onClose={handleAlertClose}
                  severity="warning"
                  action={
                    <>
                      <Button color="inherit" onClick={() => setShowAlert(false)}>
                        Cancel
                      </Button>
                      <Button color="inherit" onClick={joinGroup}>
                        Join
                      </Button>
                    </>
                  }
                >
                  Are you sure you want to leave your current group and join this one?
                </Alert>
              </Snackbar>
            </Box>
          );
        }}
      />
    </Box>
  );
};
 
 
export default StudentGroupTable;
