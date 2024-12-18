import { FormControl } from '@material-ui/core'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Autocomplete
} from '@mui/material'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import Group from '../../../entities/Group'
import groupService from '../../../services/groupService'
import createGroupSchema from '../../../schemas/createGroupSchema'
import { useTranslation } from 'react-i18next'
import { professorEmail } from '../../../helpers/GetProfessorEmail'

const GroupForm = ({
  open,
  columns,
  fetchData,
  projects,
  students,
  sections,
  setRefreshTrigger,
  groups,
  setCreateModalOpen,
  update,
  editingRow
}) => {
  const [, setAutoGroupNumber] = useState('Will be assigned automatically')
  const [isFocused, setIsFocused] = useState(false)
  const { t } = useTranslation()
  const [isloading, setIsLoading] = useState(false)

  const [initialGroupValues] = useState(
    update
      ? new Group(editingRow)
      : new Group({
        professorEmail: professorEmail()
      })
  )

  const onSubmit = async (values, actions) => {
    try {
      setIsLoading(true)
      values.group_id = values.group_id.trim()
      const addResponse = await groupService.add(values)

      if (addResponse.success) {
        await fetchData()
        // Update the UI or state with the new group number
        setAutoGroupNumber(`Group Number: ${addResponse.groupNumber}`)
        setRefreshTrigger(prev => !prev)

        console.log(addResponse.message) // "Group added successfully"
      } else {
        console.error(addResponse.message) // Log or show the error message
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setIsLoading(false)
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
    setFieldValue,
    handleSubmit
  } = useFormik({
    initialValues: initialGroupValues.toJSON(),
    validationSchema: createGroupSchema(groups),
    onSubmit
  })

  const handleClose = () => {
    setCreateModalOpen(false)
  }

  return (
    <Dialog open={open || update}>
      <DialogTitle textAlign="center">
        {t('group-table.create-group')}
      </DialogTitle>
      {isloading
        ? (
        <CircularProgress size={100}></CircularProgress>
          )
        : (
        <form acceptCharset="Enter" onSubmit={handleSubmit}>
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
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="group_number_section">{t('common.GroupNumber')}</InputLabel>
                      <TextField
                        disabled
                        value="Will be assigned automatically"
                        helperText="Group number will be assigned automatically upon creation."
                      />
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
                            onDelete={() => {
                              const newMembers = values.members.filter((id) => id !== value)
                              setFieldValue('members', newMembers)
                            }}
                          />
                        )
                      })}
                    </Box>
                  <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel id="demo-multiple-chip-label">{t('common.Members')}</InputLabel>
                  <Autocomplete
                  multiple
                  id="members-autocomplete"
                  options={students.filter((student) => !student.group)}
                  getOptionLabel={(option) => `${option.orgdefinedid} - ${option.firstname} ${option.lastname}`}
                  value={students.filter((student) => values.members.includes(student.orgdefinedid))}
                  onChange={(_event, newValue) => {
                    setFieldValue('members', newValue.map((student) => student.orgdefinedid))
                  }}
                  filterOptions={(options, { inputValue }) => options.filter((option) =>
                    `${option.firstname} ${option.lastname}`.toLowerCase().includes(inputValue.toLowerCase())
                  )}
                  renderTags={() => null}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label={isFocused ? '' : 'Search for students…'}
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
                      <InputLabel id="project-label">
                        {t('common.Project')}
                      </InputLabel>
                      <Select
                        labelId="project-label"
                        key={column.accessorKey}
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
                      >
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
                      <InputLabel id="section-label">
                        {t('common.Section')}
                      </InputLabel>
                      <Select
                        labelId="section-label"
                        key={column.accessorKey}
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
                      >
                        {sections.map((option) => (
                          <MenuItem key={option.name} value={option.name}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched[column.accessorKey] && errors[column.accessorKey]
                        ? (
                      <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                      {errors[column.accessorKey]} {/* Display the error message */}
                      </Typography>
                          )
                        : null}
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
              {t('common.Create')}
            </Button>
          </DialogActions>
        </form>
          )}
    </Dialog>
  )
}

export default GroupForm
