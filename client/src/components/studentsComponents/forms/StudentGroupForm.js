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

import React, { useState } from 'react'
import Group from '../../../entities/Group'
import groupService from '../../../services/groupService'
import createGroupSchema from '../../../schemas/createGroupSchema'
import { useTranslation } from 'react-i18next'

const StudentGroupForm = ({
  open,
  columns,
  fetchData,
  projects,
  students,
  groups,
  setCreateModalOpen,
  update,
  setUpdate,
  editingRow,
  setEditingRow,
  professorEmail,
  currentStudent
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
  const { t } = useTranslation()

  const [initialGroupValues] = useState(
    update
      ? new Group(editingRow)
      : new Group({
        professorEmail
      })
  )

  const onSubmit = async (values, actions) => {
    try {
      if (update) {
        await groupService.update(editingRow._id, values)
      } else {
        values.members.push(currentStudent.orgdefinedid)
        await groupService.add(values)
      }
      handleClose()
      fetchData()
      actions.resetForm()
    } catch (error) {
      console.log('error', error)
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
    validationSchema: createGroupSchema(groups, editingRow?._id),
    onSubmit
  })

  const handleClose = () => {
    setCreateModalOpen(false)
    setUpdate(false)
    setEditingRow({})
  }

  return (
    <Dialog open={open || update}>
      <DialogTitle textAlign="center">{update ? t('common.Edit') : t('common.Create')} {t('common.Group')}</DialogTitle>
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
                    if (currentStudent) {
                      const display = currentStudent.firstname + ' ' + currentStudent.lastname
                      return (
                      <div>
                        <InputLabel id="project-label">{t('common.Members')}</InputLabel>
                        <Chip sx = {{ marginBottom: '5px' }} color="success" label={display} />
                      </div>
                      )
                    }
              }

              if (column.accessorKey === 'project') {
                return null
              }

              if (column.accessorKey === 'interest') {
                return (
                  <FormControl>
                    <InputLabel id="project-label">{t('common.interested-projects')}</InputLabel>
                    <Select
                      labelId="interested-label"
                      multiple
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
            {update ? t('common.Save') : t('common.Create')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default StudentGroupForm
