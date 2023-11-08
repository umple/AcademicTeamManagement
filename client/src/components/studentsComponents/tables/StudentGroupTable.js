import React, { useMemo, useState, useEffect } from 'react';
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
import StudentGroupForm from '../forms/StudentGroupForm';
import projectService from '../../../services/projectService';
import studentService from "../../../services/studentService";
import groupService from "../../../services/groupService";
import { getUserType } from "../../../helpers/UserType"
import { ROLES } from "../../../helpers/Roles";
import { FilterDataByProfessor } from "../../../helpers/FilterDataByProfessor";

const StudentGroupTable = () => {

  // For the create profile modal
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [tableData, setTableData] = useState({});
  const [students, setStudents] = useState([]);
  const [group, setGroup] = useState();
  const [isCurrentUserInGroup, setisCurrentUserInGroup] = useState(false)
  const [showAlert, setShowAlert] = useState(false);
  const [showJoinedTeam, setShowJoinedTeam] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [editingRow, setEditingRow] = useState({});
  const [projects, setProjects] = useState([]);



  // State variable to control the visibility of the create student group modal
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Function to open the create student group modal
  const openCreateStudentGroupModal = () => {
    setCreateModalOpen(true);
  };

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

  const fetchProjects = async () => {
    try {
      const projects = await projectService.get();

      if (projects.projects && projects.message !== "Project list is empty.") {
        const filteredProjects = projects.projects.filter(
          (project) => project.status !== "assigned"
        );
        setProjects(filteredProjects);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const students = await studentService.get();

      if (students.message !== "Student list is empty.") {
        students.students && setStudents(students.students);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchGroups = async () => {
    try {
      let userType = ""
      const groups = await groupService.get();

      await getUserType()
      .then((type) => {
        userType = type
      })
      .catch((error) => {
        console.error(error);
      });

      if (groups.groups && groups.message !== "Group list is empty.") {
        if (userType === ROLES.ADMIN) {
          setTableData(groups.groups); // show all data for admin users
        } else {
          const professorEmail = JSON.parse(localStorage.getItem("userEmail"));
          const filteredGroupTableData = FilterDataByProfessor(
            groups.groups,
            professorEmail
          );
          setTableData(filteredGroupTableData);
        }
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const fetchData = async () => {
    await fetchProjects();
    await fetchStudents();
    await fetchGroups();
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h2" align="center" fontWeight="fontWeightBold" sx={{ marginBottom: '0.5rem' }}>Student Groups</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={openCreateStudentGroupModal}  // Open the create student group modal when the button is clicked
        sx={{ marginBottom: '1rem' }}
      >
        Create Group
      </Button>
      {(update || createModalOpen) && (
        <StudentGroupForm
          columns={columns}
          open={createModalOpen}
          fetchData={fetchData}
          projects={projects}
          students={students}
          groups={tableData}
          setCreateModalOpen={setCreateModalOpen}
          update={update}
          setUpdate={setUpdate}
          setEditingRow={setEditingRow}
          editingRow={editingRow}
        />
      )}

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