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
  OutlinedInput,
  Select,
  Stack,
  TextField
} from '@mui/material'
import Chip from '@mui/material/Chip'
import { useTheme } from '@mui/material/styles'
import { useFormik } from 'formik'

import React, { useState } from 'react'
import Group from '../../../entities/Group'
import groupService from '../../../services/groupService'
import createGroupSchema from '../../../schemas/createGroupSchema'
import { useTranslation } from 'react-i18next'

const GroupForm = ({
  open,
  columns,
  fetchData,
  projects,
  students,
  groups,
  setCreateModalOpen,
  update,
  editingRow
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
  const { t } = useTranslation()

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
  const [isloading, setIsLoading] = useState(false)

  const [initialGroupValues] = useState(
    update
      ? new Group(editingRow)
      : new Group({
        professorEmail: JSON.parse(localStorage.getItem('userEmail'))
      })
  )

  const onSubmit = async (values, actions) => {
    try {
      setIsLoading(true)
      values.group_id = values.group_id.trim()
      await groupService.add(values)

      fetchData()
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
                          <OutlinedInput
                            id="select-multiple-chip"
                            label="Chip"
                          />
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
                            if (
                              student.group === null ||
                              student.group === ''
                            ) {
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
                    </FormControl>
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
              {t('common.Create')}
            </Button>
          </DialogActions>
        </form>
          )}
    </Dialog>
  )
}

export default GroupForm
