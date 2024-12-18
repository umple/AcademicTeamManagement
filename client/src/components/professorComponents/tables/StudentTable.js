import { Paper } from '@material-ui/core'
import {
  Delete,
  Edit,
  FileUpload as FileUploadIcon
} from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import { ExportToCsv } from 'export-to-csv'
import MaterialReactTable from 'material-react-table'
import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useContext
} from 'react'
import { FilterDataByProfessor } from '../../../helpers/FilterDataByProfessor'
import { csvOptions, handleExportData } from '../../../helpers/exportData'
import studentService from '../../../services/studentService'
import groupService from '../../../services/groupService'
import ImportStudents from '../ImportStudents'
import { RefreshContext } from '../../../contexts/RefreshContext'
import StudentForm from '../forms/StudentForm'
import { useStyles } from './styles/StudentTableStyles'
import ConfirmDeletionModal from '../../common/ConfirmDeletionModal'
import { ROLES } from '../../../helpers/Roles'
import { getUserType } from '../../../helpers/UserType'
import EditStudentForm from '../forms/EditStudentModal'
import DeleteIcon from '@mui/icons-material/Delete'
import GroupIcon from '@mui/icons-material/Group'
import { useTranslation } from 'react-i18next'
import { MRT_Localization_EN } from 'material-react-table/locales/en'
import { MRT_Localization_FR } from 'material-react-table/locales/fr'
import MoveStudentsModal from '../forms/MoveStudentsModal'
import { DEFAULT_PAGE_SIZE } from '../../../helpers/Constants'
import { professorEmail } from '../../../helpers/GetProfessorEmail'

const StudentTable = () => {
  // Handle translation of the page
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language

  const getTableLocalization = (language) => {
    return language === 'fr' ? MRT_Localization_FR : MRT_Localization_EN
  }

  const [tableLocalization, setTableLocalization] = useState(getTableLocalization(currentLanguage))

  useEffect(() => {
    setTableLocalization(getTableLocalization(currentLanguage))
  }, [currentLanguage])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'orgdefinedid',
        header: t('table.student-id')
      },
      {
        accessorKey: 'username',
        header: t('table.username')
      },
      {
        accessorKey: 'lastname',
        header: t('table.lastname')
      },
      {
        accessorKey: 'firstname',
        header: t('table.firstname')
      },
      {
        accessorKey: 'email',
        header: t('table.email')
      },
      {
        accessorKey: 'sections',
        header: t('table.sections')
      },
      {
        accessorKey: 'finalGrade',
        header: t('table.final-grade')
      },
      {
        accessorKey: 'group_number',
        header: t('common.GroupNumber')
      },
      {
        accessorKey: 'group',
        header: t('table.group')
      }
    ],
    [currentLanguage]
  )

  // For the create profile modal
  const classes = useStyles()
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [tableData, setTableData] = useState([])
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [importSuccess, setImportSuccess] = useState(false)
  const [deletion, setOpenDeletion] = useState(false)
  const [row, setDeleteRow] = useState()
  const [editingRow, setEditingRow] = useState(null)
  const [deletionModal, setDeletionModal] = useState(false)
  const [moveStudentsModalOpen, setMoveStudentsModalOpen] = useState(false)
  const { refreshTrigger, setRefreshTrigger } = useContext(RefreshContext)
  const table = useRef(null)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [showAllRows, setShowAllRows] = useState(false)
  const [isUserTA, setIsUserTA] = useState(false)

  // Expand the table to include rows for all table data
  const handleExpandTable = () => {
    setShowAllRows(true)
    setPageSize(tableData.length)
  }

  // Alert message for success
  function handleImportSuccess (success) {
    setImportSuccess(success)
    if (success) {
      setTimeout(() => setImportSuccess(false), 4000) // 5 seconds delay
    }
  }

  const fetchUserRole = async () => {
    const userType = await getUserType()
    setIsUserTA(userType === 'TA')
  }

  const fetchStudents = async () => {
    try {
      let userType = ''
      const students = await studentService.get()
      console.log('Fetched students in StudentTable after creation:', students)

      await getUserType()
        .then((type) => {
          userType = type
        })
        .catch((error) => {
          console.error(error)
        })

      if (students.students) {
        if (userType === ROLES.ADMIN) {
          setTableData(students.students) // show all data if user is an admin
        } else {
          const filteredStudentsTableData = FilterDataByProfessor(
            students.students,
            professorEmail()
          ) // keep only the data that contains the professor's email
          setTableData(filteredStudentsTableData)
        }
      } else {
        setTableData([])
      }
    } catch (error) {
      console.error('There was a problem with the network request:', error)
    }
  }

  const fetchGroups = async () => {
    try {
      const groups = await groupService.get()

      const userType = await getUserType().catch((error) => {
        console.error(error)
      })

      if (groups.groups && groups.message !== 'Group list is empty.') {
        let filteredGroupTableData

        if (userType === ROLES.ADMIN) {
          filteredGroupTableData = groups.groups// Show all data for admin users
        } else {
          filteredGroupTableData = FilterDataByProfessor(groups.groups, professorEmail())// Filter data for professors
        }
        console.log(filteredGroupTableData)
      }
    } catch (error) {
      console.error('Error fetching groups:', error)
    }
  }

  const handleDeletion = async (row) => {
    try {
      await studentService.delete(row.original._id)
      setOpenDeletion(false)
      fetchStudents()
      fetchGroups()
    } catch (error) {
      console.log(error)
    }
  }

  const handleBulkDeletion = async (rows) => {
    try {
      await studentService.deleteBulkStudents(rows)
      setDeletionModal(false)
      setRowSelection({})
      fetchStudents()
      fetchGroups()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchUserRole()
    fetchStudents()
    fetchGroups()
  }, [refreshTrigger])

  const csvExporter = new ExportToCsv(csvOptions('StudentsFromAcTeams-'))
  const [isImportModalOpen, setImportModalOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})

  const closeModal = () => {
    setImportModalOpen(false)
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h2"
        align="center"
        fontWeight="fontWeight"
        sx={{ marginBottom: '1rem', marginTop: '9rem' }}
      >
        {t('students-table.students')}
      </Typography>
      {importSuccess && (
        <Alert severity="success">
          <AlertTitle>{t('students-table.success')}</AlertTitle>
          {t('students-table.success-alert')} — <strong>{t('students-table.success-import')}</strong>
        </Alert>
      )}
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
        ref={table}
        onRowSelectionChange={setRowSelection}
        state={{ rowSelection }}
        editingMode="modal"
        getRowId= {(originalRow) => originalRow._id}
        localization={tableLocalization}
        enableRowSelection
        enableColumnOrdering
        enableColumnResizing
        columnResizeMode="onChange" // default is "onEnd"
        defaultColumn={{
          minSize: 100,
          size: 150 // default size is usually 180
        }}
        enableEditing
        initialState={{ showColumnFilters: false, density: 'compact' }}
        // onEditingRowSave={handleSaveRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton
                onClick={() => {
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
                name="deleteStudent"
                onClick={() => {
                  setOpenDeletion(true)
                  setDeleteRow(row)
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Box
            sx={{
              display: 'flex',
              gap: '1rem',
              p: '0.5rem',
              flexDirection: 'row'
            }}
          >
            <Button
              color="success"
              onClick={() => setCreateModalOpen(true)}
              variant="contained"
              name="create-new-student"
            >
              {t('students-table.create-student')}
            </Button>
            <Button
              color="primary"
              onClick={() => handleExportData(tableData, columns, csvExporter)}
              startIcon={<FileDownloadIcon />}
              variant="contained"
            >
              {t('common.export-data')}
            </Button>
            <Button
              color="warning"
              onClick={() => setImportModalOpen(true)}
              startIcon={<FileUploadIcon />}
              variant="contained"
              disabled={isUserTA}
            >
              {t('students-table.import-students')}
            </Button>
            {Object.keys(rowSelection).length > 0
              ? (
              <Button
                color="error"
                onClick={() => setDeletionModal(true)}
                startIcon={<DeleteIcon />}
                variant="contained"
              >
                {t('common.Delete')} {Object.keys(rowSelection).length} {t('common.Students')}
              </Button>
                )
              : (
              <></>
                )}

            {Object.keys(rowSelection).length > 0
              ? (
              <Button
                color="info"
                onClick={() => setMoveStudentsModalOpen(true)}
                startIcon={<GroupIcon />}
                variant="contained"
              >
                {t('students-table.change-group')} {Object.keys(rowSelection).length} {t('common.Students')}
              </Button>
                )
              : (
              <></>
                )}

            <Dialog
              PaperComponent={Paper}
              PaperProps={{ className: classes.dialogPaper }}
              scroll="paper"
              open={isImportModalOpen}
              onClose={() => setImportModalOpen(false)}
            >
              <DialogTitle className={classes.dialogTitle}>
              {t('students-table.import-students')}{' '}
                <IconButton
                  className={classes.closeButton}
                  onClick={() => setImportModalOpen(false)}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>

              <ImportStudents
                fetchStudents={fetchStudents}
                columns={columns}
                handleImportSuccess={handleImportSuccess}
                closeModal={closeModal}
              />
            </Dialog>

            {deletionModal && (
              <ConfirmDeletionModal
                setOpen={setDeletionModal}
                open={deletionModal}
                handleDeletion={handleBulkDeletion}
                row={rowSelection}
                type={'bulk'}
              ></ConfirmDeletionModal>
            )}

            {moveStudentsModalOpen && (
              <MoveStudentsModal
                columns={columns}
                open={moveStudentsModalOpen}
                setMoveStudentsModalOpen={setMoveStudentsModalOpen}
                studentsSelected={rowSelection}
                fetchStudents={fetchStudents}
                setRowSelection={setRowSelection}
                setRefreshTrigger={setRefreshTrigger}
              />
            )}
          </Box>
        )}
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

      {editingRow && (
        <EditStudentForm
          columns={columns}
          open={editModalOpen}
          setEditModalOpen={setEditModalOpen}
          setEditingRow={setEditingRow}
          setRefreshTrigger={setRefreshTrigger}
          studentData={editingRow}
          students={tableData}
        />
      )}

      <StudentForm
        columns={columns}
        open={createModalOpen}
        setCreateModalOpen={setCreateModalOpen}
        fetchStudents={fetchStudents}
        students={tableData}
      />

      {deletion && (
        <ConfirmDeletionModal
          setOpen={setOpenDeletion}
          open={deletion}
          handleDeletion={handleDeletion}
          row={row}
          type={'student'}
        ></ConfirmDeletionModal>
      )}
    </Box>
  )
}

export default StudentTable
