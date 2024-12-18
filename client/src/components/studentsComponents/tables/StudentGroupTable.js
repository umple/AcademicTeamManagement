import React, { useMemo, useState, useEffect } from 'react'
import MaterialReactTable from 'material-react-table'
import Tooltip from '@mui/material/Tooltip'

import {
  Box,
  Button,
  Typography,
  Alert,
  Snackbar
} from '@mui/material'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import StudentGroupForm from '../forms/StudentGroupForm'
import projectService from '../../../services/projectService'
import studentService from '../../../services/studentService'
import groupService from '../../../services/groupService'
import { getUserEmail } from '../../../helpers/UserEmail'
import { FilterDataByProfessor } from '../../../helpers/FilterDataByProfessor'
import { useTranslation } from 'react-i18next'
import { MRT_Localization_EN } from 'material-react-table/locales/en'
import { MRT_Localization_FR } from 'material-react-table/locales/fr'

const StudentGroupTable = () => {
  // For the create profile modal
  const [refreshTrigger] = useState(false)
  const [tableData, setTableData] = useState({})
  const [students, setStudents] = useState([])
  const [group, setGroup] = useState()
  const [groupMembers, setGroupMembers] = useState([])
  const [professorEmail, setProfessorEmail] = useState('')
  const [isCurrentUserInGroup, setisCurrentUserInGroup] = useState(false)
  const [currentStudent, setCurrentStudent] = useState({})
  const [showAlert, setShowAlert] = useState(false)
  const [showJoinedTeam, setShowJoinedTeam] = useState(false)
  const [loading] = useState(false)
  const [update, setUpdate] = useState(false)
  const [editingRow, setEditingRow] = useState({})
  const [projects, setProjects] = useState([])

  // handle translation
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language
  const getTableLocalization = (language) => {
    return language === 'fr' ? MRT_Localization_FR : MRT_Localization_EN
  }

  const [tableLocalization, setTableLocalization] = useState(getTableLocalization(currentLanguage))

  useEffect(() => {
    setTableLocalization(getTableLocalization(currentLanguage))
  }, [currentLanguage])

  // State variable to control the visibility of the create student group modal
  const [createModalOpen, setCreateModalOpen] = useState(false)

  // Function to open the create student group modal
  const openCreateStudentGroupModal = () => {
    setCreateModalOpen(true)
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'group_id',
        header: t('common.Group')
      },
      {
        accessorKey: 'members',
        header: t('common.Members'),
        Cell: ({ cell }) => {
          if (Array.isArray(cell.getValue('members')) && cell.getValue('members').length > 0) {
            if (students.length !== 0) {
              return cell.getValue('members').map((value, index) => {
                const student = students.find((student) => {
                  return student.orgdefinedid === value
                })

                if (typeof student !== 'undefined') {
                  const display = student.firstname + ' ' + student.lastname
                  return (
                  <div>
                    <Chip sx = {{ marginBottom: '5px' }} color="success" label={display} />
                  </div>
                  )
                }
                return null
              })
            }
          } else {
            return <Chip sx = {{ marginBottom: '5px' }} color="error" label={'Empty Group'} />
          }
        }
      },
      {
        accessorKey: 'project',
        header: t('common.Project'),
        Cell: ({ cell }) => {
          if (cell.getValue('project').length > 0) {
            return (
              <div>
                <Chip sx = {{ marginBottom: '5px' }} color="secondary" label={cell.getValue('project')}/>
              </div>
            )
          } else {
            return null
          }
        }
      },
      {
        accessorKey: 'interest',
        header: t('common.interested-projects'),
        Cell: ({ cell }) => {
          if (Array.isArray(cell.getValue('interest')) && cell.getValue('interest').length > 0) {
            return cell.getValue('interest').map((value, index) => {
              return (
                  <div>
                    <Chip sx = {{ marginBottom: '5px' }} color="primary" label={value}/>
                  </div>
              )
            })
          } else {
            return null
          }
        }
      },
      {
        accessorKey: 'notes',
        header: t('section.notes')
      }
    ],
    [students, currentLanguage]
  )

  const fetchProjects = async () => {
    try {
      const projects = await projectService.get()

      if (projects.projects && projects.message !== 'Project list is empty.') {
        const filteredProjects = projects.projects.filter(
          (project) => project.status === 'Available'
        )
        setProjects(filteredProjects)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const fetchStudents = async () => {
    try {
      const students = await studentService.get()

      if (students.message !== 'Student list is empty.' && students.students) {
        setStudents(students.students)
      }

      const Email = await getUserEmail()
      if (students.count && students.count > 0) {
        const currStudent = students.students.filter(
          (student) => student.email === Email
        )
        setCurrentStudent(currStudent[0])
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const fetchGroups = async () => {
    try {
      const groups = await groupService.get()
      const student = await studentService.getByEmail(JSON.parse(localStorage.getItem('userEmail')))

      if (groups.groups && groups.message !== 'Group list is empty.') {
        const professorEmail = student?.professorEmail
        setProfessorEmail(professorEmail)
        const filteredGroupTableData = FilterDataByProfessor(
          groups.groups,
          professorEmail
        )
        setTableData(filteredGroupTableData)
      } else {
        setTableData([])
      }
    } catch (error) {
      console.error('Error fetching groups:', error)
    }
  }

  const fetchCurrUserGroup = async () => {
    // Check if the user has a group or not
    try {
      const groupData = await groupService.getCurrGroup()
      if (!groupData.error) {
        groupData && setGroup(groupData?.group_id)
        groupData && setGroupMembers(groupData?.members)
        setisCurrentUserInGroup(true)
      }
    } catch (error) {
      console.error(error)
      setGroup({})
    }
  }

  const fetchData = async () => {
    await fetchProjects()
    await fetchStudents()
    await fetchGroups()
    await fetchCurrUserGroup()
  }

  useEffect(() => {
    fetchData()
  }, [refreshTrigger])

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h2" align="center" fontWeight="fontWeight" sx={{ marginBottom: '1rem', marginTop: '9rem' }}>{t('group-table.student-groups')}</Typography>
      <Tooltip
        title={isCurrentUserInGroup ? 'You are already in a group and not able to create another group' : ''}
        arrow
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: '#f44336',
              color: 'white',
              fontSize: '14px',
              padding: '10px 15px',
              borderRadius: '4px',
              boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)',
              marginLeft: '13px'
            }
          },
          arrow: {
            sx: {
              color: '#f44336'
            }
          }
        }}
      >
        <span>
          <Button
            variant="contained"
            color="primary"
            disabled={isCurrentUserInGroup}
            onClick={openCreateStudentGroupModal}
            sx={{ marginBottom: '1rem' }}
          >
            {t('group-table.create-group')}
          </Button>
        </span>
      </Tooltip>
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
          professorEmail={professorEmail}
          currentStudent={currentStudent}
        />
      )}

      <Snackbar open={showJoinedTeam} onClose={() => setShowJoinedTeam(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="success">
        {t('group-table.member-added')}
        </Alert>
      </Snackbar>
      {loading
        ? (
            <CircularProgress />
          )
        : (
          <MaterialReactTable
            displayColumnDefOptions={{
              'mrt-row-actions': {
                muiTableHeadCellProps: {
                  align: 'center'
                },
                size: 120
              }
            }}

            enablePagination={false}
            columns={columns}
            data={tableData}
            editingMode="modal"
            enableColumnOrdering
            enableColumnResizing
            columnResizeMode="onChange" // default is "onEnd"
            defaultColumn={{
              minSize: 100,
              size: 150 // default size is usually 180
            }}
            enableEditing
            localization={tableLocalization}
            initialState={{ showColumnFilters: false, showGlobalFilter: true, density: 'compact' }}
            renderRowActions={({ row, table }) => {
              const joinGroup = () => {
                fetch('api/add/group/member', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(row)
                })
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error('Something happened')
                    }
                    return response.json()
                  })
                  .then((data) => {
                    fetchData()
                    setShowAlert(false)
                    setShowJoinedTeam(true)
                  })
                  .catch((error) => {
                    console.error('Error:', error)
                  })
              }

              const isLastStudentInGroup = () => {
                return !(group && groupMembers.length > 1)
              }

              const handleLeaveGroup = async (orgdefinedId) => {
                console.log('Entered handleLeaveGroup')

                if (isLastStudentInGroup()) {
                  alert('There should be at least one member in the group')
                  return
                }

                try {
                  const response = await fetch(`/api/remove/group/member/${group}/${orgdefinedId}`, {
                    method: 'DELETE',
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  })

                  if (!response.ok) {
                    console.error(`Failed to leave group: ${response.status} ${response.statusText}`)
                    throw new Error(`Failed to leave group: ${response.status} ${response.statusText}`)
                  }
                  fetchData()
                  setGroup({})
                  setisCurrentUserInGroup(false)
                } catch (error) {
                  console.error('Error leaving group:', error)
                }
              }

              const handleAlertClose = (event, reason) => {
                if (reason === 'clickaway') {
                  return
                }
                setShowAlert(false)
              }

              const handleJoinClick = async () => {
                joinGroup()
              }

              return (
                <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
                  <Button onClick={() => handleJoinClick()} disabled={isCurrentUserInGroup || (typeof group !== 'undefined' && row.original.group_id === group) || row.original.members.length >= 5 || row.original.professorLock || row.original.studentLock || (row.original.sections !== currentStudent.sections)}>{t('group-table.join')}</Button>
                  {row.original.group_id === group && <Button disabled={row.original.professorLock} color="error" onClick={() => handleLeaveGroup(currentStudent.orgdefinedid)}> {t('common.Leave')} </Button>}
                  <Snackbar open={showAlert} onClose={handleAlertClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <Alert
                      onClose={handleAlertClose}
                      severity="warning"
                      action={
                        <>
                          <Button color="inherit" onClick={() => setShowAlert(false)}>
                            {t('common.Cancel')}
                          </Button>
                          <Button color="inherit" onClick={joinGroup}>
                            {t('group-table.join')}
                          </Button>
                        </>
                      }
                    >
                      {t('group-table.confirmation')}
                    </Alert>
                  </Snackbar>
                </Box>
              )
            }}
          />)}
    </Box>
  )
}

export default StudentGroupTable
