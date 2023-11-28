import {
  Delete,
  Edit
} from '@mui/icons-material'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material'
import { ExportToCsv } from 'export-to-csv'
import MaterialReactTable from 'material-react-table'
import React, { useEffect, useMemo, useState } from 'react'
import { csvOptions, handleExportData } from '../../../helpers/exportData'
import staffService from '../../../services/staffService'
import StaffForm from '../forms/StaffForm'
import ConfirmDeletionModal from '../../common/ConfirmDeletionModal'
import { DEFAULT_PAGE_SIZE } from '../../../helpers/Constants'
import { useTranslation } from 'react-i18next'
import { MRT_Localization_EN } from 'material-react-table/locales/en'
import { MRT_Localization_FR } from 'material-react-table/locales/fr'

const StaffTable = () => {
  // Staff table localization
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language

  const getTableLocalization = (language) => {
    return language === 'fr' ? MRT_Localization_FR : MRT_Localization_EN
  }

  const [tableLocalization, setTableLocalization] = useState(getTableLocalization(currentLanguage))

  useEffect(() => {
    setTableLocalization(getTableLocalization(currentLanguage))
  }, [currentLanguage])

  const defaultColumns = useMemo(
    () => [
      {
        accessorKey: 'email',
        header: t('table.email')
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
        accessorKey: 'role',
        header: t('staff.role')
      }
    ],
    []
  )
  // For the create profile modal
  const [columns] = useState(defaultColumns)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [tableData, setTableData] = useState([])
  const [deletion, setOpenDeletion] = useState(false)
  const [row, setDeleteRow] = useState()
  const [editingRow, setEditingRow] = useState({})
  const [update, setUpdate] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(false)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [showAllRows, setShowAllRows] = useState(false)

  // Expand the table to include rows for all table data
  const handleExpandTable = () => {
    setShowAllRows(true)
    setPageSize(tableData.length)
  }

  const fetchStaffs = async () => {
    try {
      const staff = await staffService.get()
      staff.staff && setTableData(staff.staff)
    } catch (error) {
      console.error('There was a problem with the network request:', error)
    }
  }

  useEffect(() => {
    fetchStaffs()
  }, [refreshTrigger])

  const handleDeletion = async (row) => {
    try {
      await staffService.delete(row.original._id)
      setOpenDeletion(false)
      fetchStaffs()
    } catch (error) {
      console.log(error)
    }
  }

  const csvExporter = new ExportToCsv(csvOptions('StaffsFromAcTeams-'))

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h2"
        align="center"
        fontWeight="fontWeightBold"
        sx={{ marginBottom: '0.5rem' }}
      >
        {t('staff.staff')}
      </Typography>
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
        editingMode="modal"
        localization={tableLocalization}
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
                  setEditingRow(row.original)
                  setUpdate(true)
                  setCreateModalOpen(false)
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton
                color="error"
                name="deleteStaff"
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
              name="create-new-Staff"
            >
              {t('staff.add-staff')}
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

      {(update || createModalOpen) && (
        <StaffForm
          columns={columns}
          open={createModalOpen}
          setCreateModalOpen={setCreateModalOpen}
          fetchStaffs={fetchStaffs}
          editingRow={editingRow}
          setEditingRow={setEditingRow}
          update={update}
          staffs={tableData}
          setUpdate={setUpdate}
        />
      )}
      {deletion && (
        <ConfirmDeletionModal
          setOpen={setOpenDeletion}
          open={deletion}
          handleDeletion={handleDeletion}
          setRefreshTrigger={setRefreshTrigger}
          row={row}
          type={'staff'}
        ></ConfirmDeletionModal>
      )}
    </Box>
  )
}

export default StaffTable
