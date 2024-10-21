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
  Select,
  Stack,
  Autocomplete,
  TextField
} from '@mui/material'
import Chip from '@mui/material/Chip'
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
  sections,
  groups,
  setEditModalOpen,
  groupData,
  setRefreshTrigger,
  setEditingRow
}) => {
  const [initialGroupValues] = useState(
    new Group(groupData.original)
  )
  const [isFocused, setIsFocused] = useState(false)
  // Set the translation
  const { t } = useTranslation()

  const handleClose = () => {
    setEditingRow(null)
    setEditModalOpen(false)
    setFieldValue({})
  }
  const filterOptions = (options, { inputValue }) => {
    return options.filter((option) =>
      `${option.firstname} ${option.lastname}`.toLowerCase().includes(inputValue.toLowerCase())
    )
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
  const handleDeleteMember = async (memberId) => {
    // Attempt to remove the member from the group in the backend
    try {
      const result = await groupService.removeStudentFromGroup(groupData.original._id, memberId)
      if (result && result.success) {
        // Filter out the member to delete from the local state
        const updatedMembers = values.members.filter(id => id !== memberId)
        // Update the form field value to reflect the removed member
        setFieldValue('members', updatedMembers, true)
      } else {
        console.error('Failed to remove member from group')
      }
    } catch (error) {
      console.error('Error removing member from group:', error)
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
              if (column.accessorKey === 'group_number') {
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
                              (student) => student._id === value
                            )
                            const display =
                              student._id +
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
              if (column.accessorKey === 'members') {
                return (
                  <React.Fragment key="members-section">
                    {/* Display Chips for Selected Members Outside the Select */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {values.members.map((value) => {
                        const student = students.find((student) => student.orgdefinedid === value)
                        if (!student) return null // Skip rendering if student not found
                        const display = `${student.orgdefinedid} - ${student.firstname} ${student.lastname}`
                        return (
                          <Chip
                            color="primary"
                            key={value}
                            label={display}
                            onDelete={(event) => {
                              event.stopPropagation()// Prevent Select from opening
                              handleDeleteMember(value).catch(console.error) // Handle async call
                            }}
                          />
                        )
                      })}
                    </Box>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <InputLabel id="demo-multiple-chip-label">{t('common.AddMembers')}</InputLabel>
                      <Autocomplete
                        multiple
                        id="members-autocomplete"
                        options={students.filter((student) =>
                          !student.group || // Include students not in any group
                          values.members.includes(student.orgdefinedid) // Include currently selected members
                        )}
                        value={students.filter((student) => values.members.includes(student.orgdefinedid))}
                        onChange={(_event, newValue) => {
                          setFieldValue('members', newValue.map((student) => student.orgdefinedid))
                        }}
                        getOptionLabel={(option) => `${option.firstname} ${option.lastname}`}
                        filterOptions={filterOptions}
                        renderTags={() => null}
                        filterSelectedOptions
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label={isFocused ? '' : 'Search for students…'} // Clear the label when focused
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            InputLabelProps={{
                              ...params.InputLabelProps,
                              shrink: false
                            }}
                            sx={{ mt: 2 }}
                          />
                        )}
                        sx={{ m: 0, width: '100%' }}
                      />
                    </FormControl>
                  </React.Fragment>
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

              if (column.accessorKey === 'sections') {
                return (
                  <FormControl>
                    <InputLabel id="section-label">{t('common.Section')}</InputLabel>
                    <Select
                      labelId="section-label"
                      key={column.accessorKey}
                      name={column.accessorKey}
                      defaultValue={groupData.original.sections}
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
                      disabled={true}
                    >
                      {sections.map((option) => (
                        <MenuItem key={option.name} value={option.name}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )
              }

              if (column.accessorKey === 'interest') {
                return null
              }

              if (column.accessorKey === 'ms-teams') {
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
        <DialogActions sx={{ p: '1.25rem', position: 'sticky', bottom: 0, backgroundColor: 'white' }}>
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
