// MyGroup.js
import React, { useState, useEffect, useMemo } from 'react'
import { Box, Button, Typography, Grid, Alert, Snackbar, Card, CardContent, MenuItem, Select, TableCell, Tooltip, IconButton } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { Link } from 'react-router-dom'
import Chip from '@mui/material/Chip'
import MaterialReactTable from 'material-react-table'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { fetchData } from '../../services/api'
import { colorStatus } from '../../helpers/statusColors'
import { useTranslation } from 'react-i18next'
import { MRT_Localization_EN } from 'material-react-table/locales/en'
import { MRT_Localization_FR } from 'material-react-table/locales/fr'
import projectService from '../../services/projectService'
import groupService from '../../services/groupService'
import { Delete } from '@mui/icons-material'
import ConfirmDeletionModal from '../common/ConfirmDeletionModal'

const MyGroup = () => {
  const [currentStudent, setCurrentStudent] = useState({})
  const [group, setGroup] = useState({})
  const [students, setStudents] = useState()
  const [loading, setIsLoading] = useState(false)
  const [applications, setProjectApplications] = useState({})
  const [showAlert, setShowAlert] = useState(false)
  const [deletion, setDeletion] = useState(false)
  const [row, setDeleteRow] = useState()
  const [refreshTrigger, setRefreshTrigger] = useState(false)
  const [isGroupStudentLocked, setIsGroupStudentLocked] = useState(false)
  const [isGroupProfessorLocked, setIsGroupProfessorLocked] = useState(false)
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language

  const getTableLocalization = (language) => {
    return language === 'fr' ? MRT_Localization_FR : MRT_Localization_EN
  }

  const [tableLocalization, setTableLocalization] = useState(getTableLocalization(currentLanguage))

  useEffect(() => {
    setTableLocalization(getTableLocalization(currentLanguage))
  }, [currentLanguage])

  // helper function to delete a project application
  const handleDeleteApplication = async (row) => {
    try {
      fetch(`api/application/delete/${row.original._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          return response.json()
        })
        .then(() => {
          fetchDataAndSetState()
        })
    } catch (error) {
      console.log(error)
    } finally {
      setDeletion(false)
    }
  }

  const fetchDataAndSetState = async () => {
    // Check if the user has a group or not
    try {
      const groupData = await fetchData('api/retrieve/curr/user/group')
      !groupData.error && setGroup(groupData)
      if (groupData.studentLock) {
        setIsGroupStudentLocked(groupData.studentLock)
      }
      if (groupData.professorLock) {
        setIsGroupProfessorLocked(groupData.professorLock)
      }
    } catch (error) {
      console.error(error)
      setGroup({})
    }

    // Get the student data
    try {
      setIsLoading(true)
      const studentsData = await fetchData('api/students')
      studentsData && setStudents(studentsData.students)

      const userEmail = JSON.parse(localStorage.getItem('userEmail'))
      const currentStudentData = studentsData.students.find(student => student.email === userEmail)
      setCurrentStudent(currentStudentData)
      const projectApplicationsData = await fetchData('api/retrieve/project/application')
      projectApplicationsData && setProjectApplications(projectApplicationsData)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDataAndSetState()
  }, [refreshTrigger])

  // Handle changing the rank
  const rankingsAvailable = [...Array(11).keys()]
  const handleRankingChange = async (rowId, newValue) => {
    rowId.ranking = newValue
    try {
      await projectService.updateProjectApplication(rowId._id, rowId)
      // Refresh applications
      const projectApplicationsData = await fetchData('api/retrieve/project/application')
      projectApplicationsData && setProjectApplications(projectApplicationsData)
    } catch (error) {
      console.error(error)
    }
  }

  const handleUnlockingGroup = async () => {
    try {
      const res = await groupService.studentUnlockGroup(group)
      if (res.success) {
        setIsGroupStudentLocked(false)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleLockingGroup = async () => {
    try {
      const res = await groupService.studentLockGroup(group)
      if (res.success) {
        setIsGroupStudentLocked(true)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const isLastStudentInGroup = () => {
    return !(group && group.members && group.members.length > 1)
  }

  const handleLeaveGroup = async () => {
    try {
      if (isLastStudentInGroup()) {
        alert('There should be at least one member in the group')
        return
      }
      const orgdefinedId = currentStudent.orgdefinedid
      const response = await fetch(`api/remove/group/member/${group.group_id}/${orgdefinedId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      )

      if (!response.ok) {
        throw new Error('Request failed')
      }

      await response.json()
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 4000)
      setGroup({})
      setProjectApplications({})
    } catch (error) {
      console.error(error)
    }
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'group_id',
      header: t('my-group.group')
    },
    {
      accessorKey: 'project',
      header: t('my-group.project')
    },
    {
      accessorKey: 'status',
      header: t('my-group.status'),
      Cell: ({ cell }) => (
        <Chip
          label = {cell.getValue()}
          color = {colorStatus(cell.getValue())}
          />
      )
    },
    {
      accessorKey: 'feedback',
      header: t('my-group.feedback')
    },
    {
      accessorKey: 'ranking',
      header: t('my-group.ranking'),
      Cell: ({ row, cell }) => (
        <TableCell>
          {columns.find((col) => col.accessorKey === 'ranking')
            ? (
            <Select
              value={cell.getValue()}
              onChange={(e) => handleRankingChange(row.original, e.target.value)}
            >
              {rankingsAvailable.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
              )
            : (
                cell.render('Cell')
              )}
        </TableCell>
      )
    }

  ], [currentLanguage])

  const findNameByStudentID = (orgdefinedid) => {
    const student = students.find((student) => { return student.orgdefinedid === orgdefinedid })
    return student.firstname + ' ' + student.lastname
  }

  return (
    <Box sx={{ mt: 3, marginTop: '10rem' }}>
      <Snackbar
        open={showAlert}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success">
          {t('my-group.left')}
        </Alert>
      </Snackbar>
      {loading
        ? (
        <CircularProgress />
          )
        : (
        <>
          <Card sx={{ mt: 10, mb: 4, ml: 4, mr: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {t('my-group.my-group')}
              </Typography>
              {Object.keys(group).length !== 0
                ? (
                <Box>
                  <Typography mt={2} sx={{ fontSize: '18px' }}>
                    <strong>{t('common.Group')} ID:</strong>
                  </Typography>
                  <Chip sx = {{ m: '2px' }} key={'group_id'} label={group.group_id} color="warning"></Chip>

              <Typography sx={{ mt: 1 }} gutterBottom>
                {t('my-group.lock-group-message')}
              </Typography>
              <Grid
                container
                spacing={2}
                alignItems="center"
              >
                <Grid item>
                  <Button
                    variant="contained"
                    color="info"
                    disabled={isGroupProfessorLocked || isGroupStudentLocked}
                    onClick={handleLockingGroup}
                  >
                    <LockIcon />{t('common.lock')}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="success"
                    disabled={isGroupProfessorLocked || !isGroupStudentLocked}
                    onClick={handleUnlockingGroup}
                  >
                    <LockOpenIcon />{t('common.unlock')}
                  </Button>
                </Grid>
              </Grid>

                  <Typography mt={2} sx={{ fontSize: '18px' }}>
                    <strong> {t('my-group.members')}</strong>
                  </Typography>
                  {
                  group.members.map((element, index) => (
                    <Chip sx = {{ m: '2px' }} key={index} label={findNameByStudentID(element)} color="secondary"></Chip>
                  ))}

                  {
                  group.interest > 0 && group.interest.map((element, index) => (
                    <Chip sx = {{ m: '2px' }} key={index} label={element} color="primary"></Chip>
                  ))}

                  {
                    (group.interest && group.interest.length > 0)
                      ? (
                      <>
                      <Typography mt={2} sx={{ fontSize: '18px' }}>
                      <strong> {t('common.interested-projects')}</strong>
                      </Typography>

                       { group.interest.map((element, index) => (
                          <Chip sx = {{ m: '2px' }} key={index} label={element} color="info"></Chip>
                       ))
                      }
                      </>
                        )
                      : (
                      <></>
                        )
                  }

                  {group.project
                    ? (
                    <>
                      <Typography mt={2} sx={{ fontSize: '18px' }}>
                        <strong>{t('my-group.project2')}</strong>
                      </Typography>
                      <Chip sx = {{ m: '2px' }} key={'project_id'} label={group.project} color="success"></Chip>

                      <Grid
                      container
                      spacing={2}
                      alignItems="center"
                      sx={{ mt: 2 }}
                    >
                      <Grid item>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={handleLeaveGroup}
                        >
                          {t('my-group.leave-group')}
                        </Button>
                      </Grid>
                    </Grid>
                    </>
                      )
                    : (
                    <Grid
                      container
                      spacing={2}
                      alignItems="center"
                      sx={{ mt: 1 }}
                    >
                      <Grid item>
                        <Link
                          to="/StudentProjects"
                          style={{ textDecoration: 'none' }}
                        >
                          <Button variant="contained" color="primary">
                            {t('my-group.add-project')}
                          </Button>
                        </Link>
                      </Grid>
                      <Grid item>
                        <Button
                          disabled={isGroupProfessorLocked}
                          variant="contained"
                          color="error"
                          onClick={handleLeaveGroup}
                        >
                          {t('my-group.leave-group')}
                        </Button>
                      </Grid>
                    </Grid>
                      )}
                </Box>
                  )
                : (
                <Typography variant="h6">
                  {t('my-group.no-group')}
                </Typography>
                  )}
            </CardContent>
          </Card>
          {typeof applications !== 'undefined' || applications
            ? (
            <Box sx={{ mt: 2, ml: 4, mr: 4 }}>
              <Typography variant="h2" align="center" fontWeight="fontWeight" sx={{ mb: 2 }}>
                  {t('project.project-applications')}
              </Typography>
              <MaterialReactTable
                columns={columns}
                data={applications ?? applications.filter((app) => app.group_id === group.group_id)}
                noHeader={true}
                highlightOnHover={true}
                enableColumnFilters={false}
                enableHiding={false}
                enablePagination={false}
                enableGlobalFilter={false}
                enableFullScreenToggle={false}
                enableDensityToggle={false}
                initialState={{ showColumnFilters: true, showGlobalFilter: true, pagination: { pageSize: 200 } }}
                localization={tableLocalization}
                enableEditing
                renderRowActions={({ row, table }) => (
                  <Box sx={{ display: 'flex', gap: '1rem' }} id={`row-${row.original.group_id}`}>
                    <Tooltip arrow placement="right" title="Delete">
                      <IconButton
                        disabled={row.original.status === 'Accepted' || row.original.status === 'Rejected'}
                        color="error"
                        name="deleteGroup"
                        onClick={() => {
                          setDeleteRow(row)
                          setDeletion(true)
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
                keyField="project"
                customStyles={{
                  rows: {
                    style: {
                      '&:last-child td': { border: 0 }
                    }
                  }
                }}
              />

              {deletion && (
                <ConfirmDeletionModal
                  setOpen={setDeletion}
                  open={deletion}
                  handleDeletion={handleDeleteApplication}
                  setRefreshTrigger={setRefreshTrigger}
                  row={row}
                  type={'project'}
                ></ConfirmDeletionModal>
              )}
            </Box>
              )
            : (
            <Typography variant="h6">
              {t('my-group.no-project')}
            </Typography>
              )}
        </>
          )}
    </Box>
  )
}

export default MyGroup
