import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  DialogActions,
  FormControl,
  MenuItem,
  InputLabel,
  Select
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import studentService from '../../../services/studentService'
import { useTranslation } from 'react-i18next'
import { getUserType } from '../../../helpers/UserType'
import groupService from '../../../services/groupService'
import { ROLES } from '../../../helpers/Roles'
import { FilterDataByProfessor } from '../../../helpers/FilterDataByProfessor'
import { professorEmail } from '../../../helpers/GetProfessorEmail'

const MoveStudentsModal = ({
  open,
  setMoveStudentsModalOpen,
  studentsSelected,
  fetchStudents,
  setRowSelection
}) => {
  // Set the translation
  const { t } = useTranslation()

  // set new group data
  const [newGroup, setNewGroup] = useState('')

  // retrieve the groups
  const [groupsData, setGroupsData] = useState([])
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
          setGroupsData(groups.groups) // show all data for admin users
        } else {
          const filteredGroupTableData = FilterDataByProfessor(
            groups.groups,
            professorEmail()
          )
          setGroupsData(filteredGroupTableData)
        }
      } else {
        setGroupsData([])
      }
    } catch (error) {
      console.error('Error fetching groups:', error)
    }
  }

  useEffect(() => {
    fetchGroups()
    console.log(newGroup)
    console.log(studentsSelected)
  }, [newGroup])

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      console.log(studentsSelected)
      await studentService.updateGroupBulkStudents(studentsSelected, newGroup)
      setMoveStudentsModalOpen(false)
      setRowSelection({})
      fetchStudents()
    } catch (error) {
      console.log(error)
    }
    handleClose()
  }

  const handleClose = () => {
    setMoveStudentsModalOpen(false)
  }

  return (
      <Dialog open={open}>
        <DialogTitle textAlign="center">{t('students-table.move-students')}</DialogTitle>
        <form acceptCharset="Enter" onSubmit={handleSubmit}>
          <DialogContent>
            <Stack
              sx={{
                width: '100%',
                minWidth: { xs: '300px', sm: '360px', md: '400px' },
                gap: '1.5rem'
              }}
            >
            <FormControl fullWidth>
                <InputLabel id="group-label">{t('common.Group')}</InputLabel>
                <Select
                fullWidth
                labelId="group-label"
                variant="outlined"
                label="Group"
                defaultValue=""
                key={'group-edit'}
                name={'group-edit'}
                id="select-group"
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                >
                <MenuItem key={'no-group'} value={'null'}>({t('students-table.remove-from-groups')})</MenuItem>
                {groupsData.map((option) => (
                    <MenuItem key={option.group_id} value={option.group_id}>
                    {option.group_id}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: '1.25rem' }}>
            <Button onClick={handleClose}>{t('common.Cancel')}</Button>
            <Button color="secondary" type="submit" name="submitForm" variant="contained">
              {t('common.Save')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
  )
}
export default MoveStudentsModal
