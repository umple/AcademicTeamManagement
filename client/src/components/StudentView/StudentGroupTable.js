import React, { useState, useMemo, useEffect } from 'react';
import MaterialReactTable from 'material-react-table';
import {
  Box,
  Button,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';

const StudentGroupTable = () => {

  // For the create profile modal
  const [tableData, setTableData] = useState({});
  const [students, setStudents] = useState([]);
  const [group, setGroup] = useState();
  const [isCurrentUserInGroup, setisCurrentUserInGroup] = useState(false)
  const [showAlert, setShowAlert] = useState(false);
  const [showJoinedTeam, setShowJoinedTeam] = useState(false);
  const [loading, setIsLoading] = useState(false);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'group_id',
        header: 'Group',
      },
      {
        accessorKey: 'members',
        header: 'Members',
        Cell: ({ cell }) => {

          if (Array.isArray(cell.getValue("members")) && cell.getValue("members").length > 0) {
            if (students.length !== 0){
              return cell.getValue("members").map((value, index) => {
                let student = students.find((student) => {
                  return student.orgdefinedid === value
                });
                
                if (typeof student !== "undefined"){
                  let display = student.firstname + " " + student.lastname;
                  return (
                  <div>
                    <Chip sx = {{ marginBottom: "5px",}} color="success" label={display} />
                  </div>
                  )
                }
              });
            }
          }else{
            return <Chip sx = {{ marginBottom: "5px",}} color="error" label={"Empty Group"} />
          }
        },
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
    [students],
  );

  const fetchData = () => {
    Promise.all(
      [
        fetch("/api/groups"),
        fetch("/api/retrieve/curr/user/group"),
        fetch("/api/students")
      ])
      .then(([resGroups, currentUserGroup, resStudents]) =>
        Promise.all([resGroups.json(), currentUserGroup.json(), resStudents.json()])
      
        
      ).then(([groups, currentUserGroup, students]) => {
        
        if (groups.message !== "Group list is empty."){
          setTableData(groups)
        }

        if (typeof currentUserGroup.error === "undefined"){
          setGroup(currentUserGroup.group_id)
          setisCurrentUserInGroup(true)
        }

        if (students.message !== "Student list is empty."){
          setStudents(students)
        }
        setIsLoading(false)
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h2" align="center" fontWeight="fontWeightBold" sx={{ marginBottom: '0.5rem' }}>Student Groups</Typography>
      <Snackbar open={showJoinedTeam} onClose={() => setShowJoinedTeam(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="success">
          Group Member Added!
        </Alert>
      </Snackbar>
      {loading ? (
        <CircularProgress />
      ) : (
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
                fetchData()
                setShowAlert(false)
                setShowJoinedTeam(true)
              })
              .catch((error) => {
                console.error('Error:', error);
              });
          };

        const handleLeaveGroup = () =>{
          fetch(`api/remove/group/member/${group}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json"
            }
          })
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              fetchData()
              setGroup({})
              setisCurrentUserInGroup(false)
            })
            .catch((error) => console.error(error));
        }

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
              <Button onClick={() => handleJoinClick()} disabled={isCurrentUserInGroup || typeof group !== 'undefined' && row.original._id === group._id || row.original.members.length >= 5}>Join</Button>
              {row.original.group_id === group && <Button color= "error" onClick={() => handleLeaveGroup()}> Leave </Button>}
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
      /> )}
    </Box>
  );
};


export default StudentGroupTable;
