import { Delete, Edit } from '@mui/icons-material'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import {
  Alert,
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material'
import Chip from '@mui/material/Chip'
import { ExportToCsv } from 'export-to-csv' // or use your library of choice here
import MaterialReactTable from 'material-react-table'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FilterDataByProfessor } from '../../../helpers/FilterDataByProfessor'
import { csvOptions, handleExportData } from '../../../helpers/exportData'
import groupService from '../../../services/groupService'
import projectService from '../../../services/projectService'
import studentService from '../../../services/studentService'
import sectionService from '../../../services/sectionService'
import GroupForm from '../forms/GroupForm'
import ChatIcon from '@mui/icons-material/Chat'
import ConfirmDeletionModal from '../../common/ConfirmDeletionModal'
import EditGroupModal from '../forms/EditGroupModal'
import { ROLES } from '../../../helpers/Roles'
import { useTranslation } from 'react-i18next'
import { MRT_Localization_EN } from 'material-react-table/locales/en'
import { MRT_Localization_FR } from 'material-react-table/locales/fr'
import { getUserType } from '../../../helpers/UserType'
import { DEFAULT_PAGE_SIZE } from '../../../helpers/Constants'
import { useLocation } from 'react-router-dom'
import { professorEmail } from '../../../helpers/GetProfessorEmail'

const GroupTable = () => {
  // For the create profile modal
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const [tableData, setTableData] = useState([])
  const [projects, setProjects] = useState([])
  const [students, setStudents] = useState([])
  const [sections, setSections] = useState([])
  const [message] = useState('')
  const [deletion, setDeletion] = useState(false)
  const [row, setDeleteRow] = useState()
  const [refreshTrigger, setRefreshTrigger] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingRow, setEditingRow] = useState(null)
  const location = useLocation()

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

  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [showAllRows, setShowAllRows] = useState(false)

  // Expand the table to include rows for all table data
  const handleExpandTable = () => {
    setShowAllRows(true)
    setPageSize(tableData.length)
  }

  // Redirect to MS Teams Chat
  const handleMSTeamsRedirect = async (group_id) => {
    try {
      // get the current user's email
      const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/getuseremail`, {
        method: 'GET',
        credentials: 'include' // include cookies in the request
      })
      const data = await response.json()
      const currentUserEmail = data.userEmail

      // get the emails of group members
      const members_emails = await groupService.getGroupMembersEmails(group_id)
      if (members_emails.length === 0) {
        alert('Cannot create an MS Teams chat because the group is empty')
        return
      }

      // add the professor
      members_emails.push(currentUserEmail)

      // create the chat members
      const users_emails = members_emails.join(',')

      // redirect to the MS Teams chat
      const teamsURL = `https://teams.microsoft.com/l/chat/0/0?users=${users_emails}&topicName=${group_id}`
      window.open(teamsURL, '_blank')
    } catch (error) {
      console.error('Error creating MS Teams chat:', error)
      throw error
    }
  }

  // handle scrolling to the row selected
  const scrollToRow = useCallback((rowId) => {
    const targetRow = document.getElementById(`row-${rowId}`)
    if (targetRow) {
      targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [tableData])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const groupId = params.get('_id')

    if (groupId && tableData.length > 0) {
      scrollToRow(groupId)
    }
  }, [location.search, tableData])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'group_name',
        header: t('common.Group')
      },
      {
        accessorKey: 'members',
        header: t('common.Members'),
        Cell: ({ cell }) => {
          if (
            Array.isArray(cell.getValue('members')) &&
            cell.getValue('members').length > 0
          ) {
            if (students.length !== 0) {
              return cell.getValue('members').map((value, index) => {
                const student = students.find((student) => {
                  return student._id === value
                })

                if (typeof student !== 'undefined') {
                  const display = student.firstname + ' ' + student.lastname
                  return (
                    <div>
                      <Chip
                        sx={{ marginBottom: '5px' }}
                        color="success"
                        label={display}
                      />
                    </div>
                  )
                }
                return null
              })
            }
          } else {
            return (
              <Chip
                sx={{ marginBottom: '5px' }}
                color="error"
                label={'Empty Group'}
              />
            )
          }
        }
      },
      {
        accessorKey: 'assigned_project_id',
        header: t('common.Project'),
        Cell: ({ cell }) => {
          if (cell.getValue('assigned_project_id').length > 0) {
            return (
              <div>
                <Chip sx = {{ marginBottom: '5px' }} color="secondary" label={cell.getValue('assigned_project_id')}/>
              </div>
            )
          } else {
            return null
          }
        }
      },
      {
        accessorKey: 'interested_project_ids',
        header: t('common.interested-projects'),
        Cell: ({ cell }) => {
          if (Array.isArray(cell.getValue('interested_project_ids')) && cell.getValue('interested_project_ids').length > 0) {
            return cell.getValue('interested_project_ids').map((value, index) => {
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
        accessorKey: 'sections',
        header: t('common.Section')
      },
      {
        accessorKey: 'notes',
        header: t('section.notes')
      },
      {
        accessorKey: 'ms-teams',
        header: 'MS Teams Chat',
        Cell: ({ row }) => {
          return (
              <div>
                <Button
                  color="primary"
                  variant="outlined"
                  startIcon={<ChatIcon />}
                  onClick={() => handleMSTeamsRedirect(row.getValue('group_id'))}
                >{row.getValue('group_id')}
                </Button>
              </div>
          )
        }
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

  const fetchSections = async () => {
    try {
      const sections = await sectionService.get()

      if (sections.sections && sections.message !== 'Sections list is empty.') {
        setSections(sections.sections)
      }
    } catch (error) {
      console.error('Error fetching sections:', error)
    }
  }

  const fetchStudents = async () => {
    try {
      let userType = ''
      const students = await studentService.get()

      await getUserType()
        .then((type) => {
          userType = type
        })
        .catch((error) => {
          console.error(error)
        })

      if (students.students) {
        if (userType === ROLES.ADMIN) {
          setStudents(students.students) // show all data if user is an admin
        } else {
          const filteredStudentsTableData = FilterDataByProfessor(
            students.students,
            professorEmail()
          ) // keep only the data that contains the professor's email
          setStudents(filteredStudentsTableData)
        }
      } else {
        setStudents([])
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const fetchGroups = async () => {
    try {
      let userType = ''
      const groups = await groupService.get()

      await getUserType()
        .then((type) => {
          userType = type
        })
        .catch((error) => {
          console.error(error)
        })

      if (groups.groups && groups.message !== 'Group list is empty.') {
        if (userType === ROLES.ADMIN) {
          setTableData(groups.groups) // show all data for admin users
        } else {
          const filteredGroupTableData = FilterDataByProfessor(
            groups.groups,
            professorEmail()
          )
          setTableData(filteredGroupTableData)
        }
      } else {
        setTableData([])
      }
    } catch (error) {
      console.error('Error fetching groups:', error)
    }
  }

  const fetchData = async () => {
    await fetchProjects()
    await fetchStudents()
    await fetchGroups()
    await fetchSections()
  }

  useEffect(() => {
    fetchData()
  }, [refreshTrigger])

  const handleDeletion = async (row) => {
    try {
      await groupService.delete(row.original._id)
      setDeletion(false)
      fetchData()
    } catch (error) {
      console.log(error)
    }
  }

  const csvExporter = new ExportToCsv(csvOptions('GroupsFromAcTeams-'))

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h2"
        align="center"
        fontWeight="fontWeightBold"
        sx={{ marginBottom: '0.5rem' }}
      >
        {t('header.navbar.groups')}
      </Typography>
      {message === '' ? '' : <Alert severity="warning">{message}</Alert>}
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
        data={showAllRows ? tableData : tableData.slice(0, pageSize)}
        enableColumnOrdering
        enableColumnResizing
        columnResizeMode="onChange" // default is "onEnd"
        defaultColumn={{
          minSize: 100,
          size: 150 // default size is usually 180
        }}
        enableEditing
        initialState={{ showColumnFilters: false, showGlobalFilter: true, density: 'compact' }}
        localization={tableLocalization}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }} id={`row-${row.original.group_id}`}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton
                onClick={(e) => {
                  setEditingRow(row)
                  setEditModalOpen(true)
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton
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
        renderTopToolbarCustomActions={() => (
          <Box
            sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
          >
            <Button
              color="success"
              onClick={() => setCreateModalOpen(true)}
              variant="contained"
              name="create-new-group"
            >
              {t('group-table.create-group')}
            </Button>
            <Button
              color="primary"
              onClick={() => handleExportData(tableData, columns, csvExporter)}
              startIcon={<FileDownloadIcon />}
              variant="contained"
            >
              {t('common.export-data')}
            </Button>
          </Box>
        )}
      />

      <GroupForm
        columns={columns}
        open={createModalOpen}
        setCreateModalOpen={setCreateModalOpen}
        fetchData={fetchData}
        projects={projects}
        students={students}
        sections={sections}
        groups={tableData}
      />

      {pageSize === DEFAULT_PAGE_SIZE &&
        pageSize < tableData.length &&
        (
        <Button
          sx={{ m: 2 }}
          style={{ position: 'absolute', right: '1rem' }}
          color="secondary"
          variant="contained"
          onClick={handleExpandTable}>
          {t('common.display-all')} {tableData.length} {t('common.rows')}
        </Button>
        )}

      {deletion && (
        <ConfirmDeletionModal
          setOpen={setDeletion}
          open={deletion}
          handleDeletion={handleDeletion}
          setRefreshTrigger={setRefreshTrigger}
          row={row}
          type={'group'}
        ></ConfirmDeletionModal>
      )}

      {editingRow && (
        <EditGroupModal
          columns={columns}
          open={editModalOpen}
          setEditModalOpen={setEditModalOpen}
          setEditingRow={setEditingRow}
          setRefreshTrigger={setRefreshTrigger}
          fetchData={fetchData}
          groupData={editingRow}
          projects={[...projects, editingRow.original]}
          students={students}
          sections={sections}
          groups={tableData}
        />
      )}
    </Box>
  )
}

export default GroupTable
