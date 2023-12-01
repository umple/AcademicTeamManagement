import { FormControl } from '@material-ui/core'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField
} from '@mui/material'
import Chip from '@mui/material/Chip'
import { useTheme } from '@mui/material/styles'
import { useFormik } from 'formik'

import React, { useEffect, useState } from 'react'
import Group from '../../../entities/Group'
import groupService from '../../../services/groupService'
import createGroupSchema from '../../../schemas/createGroupSchema'
import { useTranslation } from 'react-i18next'

const EditGroupModal = ({
  open,
  columns,
  projects,
  students,
  groups,
  setEditModalOpen,
  groupData,
  setRefreshTrigger,
  setEditingRow
}) => {
  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  }

  function getStyles (name, members, theme) {
    return {
      fontWeight:
        members.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium
    }
  }

  const theme = useTheme()
  const [members] = useState([])

  const [initialGroupValues] = useState(
    new Group(groupData.original)
  )

  // Set the translation
  const { t } = useTranslation()

  const handleClose = () => {
    setEditingRow(null)
    setEditModalOpen(false)
    setFieldValue({})
  }

  const clearGroupMembers = async () => {
    try {
      const isConfirmed = window.confirm('Are you sure you want to delete all group members?')
      if (isConfirmed) {
        await groupService.clearMembers(groupData.original._id)
        window.location.reload()
      }
    } catch (error) {
      console.log('Error clearing group members', error)
    }
  }

  const onSubmit = async (values, actions) => {
    try {
      await groupService.update(groupData.original._id, values)
      setRefreshTrigger((prevState) => !prevState)
    } catch (error) {
      console.log('error', error)
    } finally {
      handleClose()
      actions.resetForm()
    }
  }

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue
  } = useFormik({
    initialValues: initialGroupValues.toJSON(),
    validationSchema: createGroupSchema(groups, groupData.original._id),
    onSubmit
  })

  useEffect(() => {
    if (groupData) {
      Object.keys(groupData.original).forEach((field) => {
        setFieldValue(field, groupData.original[field])
      })
    }
  }, [groupData])

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">{t('group-table.edit-group')}</DialogTitle>
      <form acceptCharset="Enter" onSubmit={handleSubmit} >
        <DialogContent>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem'
            }}
          >
            {columns.map((column) => {
              if (column.accessorKey === 'members') {
                return (
                  <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="demo-multiple-chip-label">
                    {t('common.Members')}
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-chip-label"
                      id="demo-multiple-chip"
                      multiple
                      name={column.accessorKey}
                      value={values[column.accessorKey]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(
                        touched[column.accessorKey] &&
                          errors[column.accessorKey]
                      )}
                      helperText={
                        touched[column.accessorKey] &&
                        errors[column.accessorKey]
                      }
                      input={
                        <OutlinedInput id="select-multiple-chip" label="Chip" />
                      }
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                        >
                          {selected.map((value) => {
                            const student = students.find(
                              (student) => student.orgdefinedid === value
                            )
                            const display =
                              student.orgdefinedid +
                              ' - ' +
                              student.firstname +
                              ' ' +
                              student.lastname
                            return (
                              <Chip
                                color="primary"
                                key={value}
                                label={display}
                              />
                            )
                          })}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {students.length > 0 &&
                        students.map((student) => {
                          if (student.group === null || student.group === '') {
                            return (
                              <MenuItem
                                key={student.orgdefinedid}
                                value={student.orgdefinedid}
                                style={getStyles(
                                  student.firstname,
                                  members,
                                  theme
                                )}
                              >
                                {student.orgdefinedid +
                                  ' - ' +
                                  student.firstname +
                                  ' ' +
                                  student.lastname}
                              </MenuItem>
                            )
                          }
                          return null
                        })}
                    </Select>
                    {groupData.original.members && groupData.original.members.length > 0 && <Button variant="text" onClick={clearGroupMembers}>Clear Members</Button>}
                  </FormControl>
                )
              }

              if (column.accessorKey === 'project') {
                return (
                  <FormControl>
                    <InputLabel id="project-label">{t('common.Project')}</InputLabel>
                    <Select
                      labelId="project-label"
                      key={column.accessorKey}
                      name={column.accessorKey}
                      defaultValue={groupData.original.project}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(
                        touched[column.accessorKey] &&
                          errors[column.accessorKey]
                      )}
                      helperText={
                        touched[column.accessorKey] &&
                        errors[column.accessorKey]
                      }
                    >
                      {
                        groupData.original.project &&
                        <MenuItem key={'no-project'} value={''}>({t('students-table.remove-project-from-groups')})</MenuItem>
                      }

                      {projects.map((option) => (
                        <MenuItem key={option.project} value={option.project}>
                          {option.project}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )
              }

              if (column.accessorKey === 'interest') {
                return null
              }

              return (
                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  value={values[column.accessorKey]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(
                    touched[column.accessorKey] && errors[column.accessorKey]
                  )}
                  helperText={
                    touched[column.accessorKey] && errors[column.accessorKey]
                  }
                />
              )
            })}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={handleClose}>{t('common.Cancel')}</Button>
          <Button color="secondary" type="submit" variant="contained">
            {t('common.Save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditGroupModal
