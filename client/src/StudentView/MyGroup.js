// MyGroup.js
import React, { useState, useEffect, useMemo } from "react";
import { Box, Button, Typography, Grid, Alert, Snackbar, TableRow, TableCell, Card, CardContent } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from "react-router-dom";
import MaterialReactTable from 'material-react-table';


const linkStyle = {
  textDecoration: "none",
};

const MyGroup = () => {
  
  const columns = useMemo(() => [
    {
      accessorKey: 'group_id',
      header: 'Group',
    },
    {
      accessorKey: 'project',
      header: 'Project',
    },
    {
      accessorKey: 'feedback',
      header: 'Feedback',
    },
    {
      accessorKey: 'students_needed',
      header: 'Students Needed',
    }
  ], []);
  const [group, setGroup] = useState({});
  const [loading, setIsLoading] = useState(true);
  const [applications, setProjectApplications] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetch("api/retrieve/curr/user/group")
      .then((response) => {
        if (!response.ok) {
          throw new Error("dsaafsd");
        } else {
          return response.json()
        }
      })
      .then((data) => {
        setGroup(data);
      })
      .catch((error) => console.error(error));


    fetch("api/retrieve/project/application")
      .then((response) => {
        if (!response.ok) {
        } else {
          return response.json()
        }
      })
      .then((data) => {

        console.log(applications)
        setProjectApplications(data);
        setIsLoading(false)
      })
      .catch((error) => console.error(error));
  }, []);

  const handleLeaveGroup = async () => {
    fetch("api/remove/group/member", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 4000);
        setGroup({})
      })
      .catch((error) => console.error(error));

  };


  return (
    <Box sx={{ mt: 3 }}>
      <Snackbar
        open={showAlert}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success">
          User has left the team successfully!
        </Alert>
      </Snackbar>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Card sx={{ mt: 10, mb: 4, ml: 4, mr: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                My Group
              </Typography>
              {Object.keys(group).length !== 0 ? (
                <Box>
                  <Typography sx={{ fontSize: "18px" }}>
                    <strong>Group ID:</strong> {group.group_id} </Typography>
                  <Typography sx={{ fontSize: "18px" }}>
                    <strong>Members:</strong>{" "}
                    {group.members && group.members.filter(member => member).join(", ")}
                  </Typography>
                  {group.project ? (
                    <Typography sx={{ fontSize: "18px" }}>
                      <strong>Project:</strong> {group.project}
                    </Typography>
                  ) : (
                    <Grid
                      container
                      spacing={2}
                      alignItems="center"
                      sx={{ mt: 1 }}
                    >
                      <Grid item>
                        <Link
                          to="/StudentProjects"
                          style={{ textDecoration: "none" }}
                        >
                          <Button variant="contained" color="primary">
                            Add Project
                          </Button>
                        </Link>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={handleLeaveGroup}
                        >
                          Leave Group
                        </Button>
                      </Grid>
                    </Grid>
                  )}
                </Box>
              ) : (
                <Typography variant="h6">
                  You have not joined a group yet.
                </Typography>
              )}
            </CardContent>
          </Card>
          {typeof applications !== "undefined" || applications ? (
            <Box sx={{ mt: 2, ml: 4, mr:4 }}>
              <MaterialReactTable
                columns={columns}
                data={applications}
                noHeader={true}
                highlightOnHover={true}
                enableColumnFilters={false}
                enableHiding={false}
                enablePagination={false} 
                enableGlobalFilter={false}
                enableFullScreenToggle={false}
                enableDensityToggle={false}
                keyField="project"
                customStyles={{
                  rows: {
                    style: {
                      '&:last-child td': { border: 0 },
                    },
                  },
                }}
              />
            </Box>
          ) : (
            <Typography variant="h6">
              You have no project applications yet.
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default MyGroup;
