import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  TextField,
  DialogActions,
  FormGroup,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress
} from '@mui/material'
import React, { useState } from 'react'
import { useFormik } from 'formik'
import { getUserEmail } from '../../../helpers/UserEmail'
import staffService from '../../../services/staffService'
import Staff from '../../../entities/Staff'
import staffSchema from '../../../schemas/staffSchema'
import { useTranslation } from 'react-i18next'
import { ROLES } from '../../../helpers/Roles'

const StaffForm = ({
  open,
  columns,
  setCreateModalOpen,
  fetchStaffs,
  update,
  setUpdate,
  editingRow,
  staffs,
  setEditingRow
}) => {
  const cellValueMap = [
    { value: ROLES.ADMIN, label: 'primary' },
    { value: ROLES.PROFESSOR, label: 'secondary' },
    { value: ROLES.TA, label: 'secondary' }
  ]
  const [isloading, setIsLoading] = useState(false)
  const { t } = useTranslation()

  const onSubmit = async (values, actions) => {
    try {
      setIsLoading(true)
      // check if the staff is a TA
      if (values.role === ROLES.TA && values.linked_professor === '') {
        const Linked_professor_Email = await getUserEmail()
        values.linked_professor = Linked_professor_Email ?? ''
      } else if (update && values.role !== ROLES.TA) {
        values.linked_professor = ''
      }
      if (update) {
        await staffService.update(editingRow._id, values)
      } else {
        if (values.email) {
          values.email = values.email.toLowerCase()
        }
        await staffService.add(values)
      }
      fetchStaffs()
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(true)
      actions.resetForm()
      handleClose()
    }
  }

  // collect the staff (either admin of professor) emails
  const staffEmails = (staffData) => {
    const staffEmailsArray = staffData
      ?.filter(member => member.role !== 'TA') // Exclude members with role 'TA'
      .map(member => member.email)
      .filter(email => email) || []
    return staffEmailsArray
  }

  const handleClose = () => {
    setCreateModalOpen(false)
    setUpdate(false)
    setEditingRow({})
  }

  const [initialStaffValues] = useState(
    update
      ? new Staff(editingRow)
      : new Staff({
        professorEmail: JSON.parse(localStorage.getItem('userEmail'))
      })
  )

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit
  } = useFormik({
    initialValues: initialStaffValues.toRequestJSON(),
    validationSchema: staffSchema(staffs, editingRow?._id),
    onSubmit
  })
  return (
    <Dialog open={open || update}>
      <DialogTitle textAlign="center">
        {update ? t('staff.edit-staff') : t('staff.add-staff')}
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
                if (update && column.accessorKey === 'email') {
                  return (
                    <TextField
                      key={column.accessorKey}
                      disabled={true}
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
                }
                if (column.accessorKey === 'role') {
                  return (
                    <FormGroup>
                      <InputLabel id="role-label">{t('staff.role')}</InputLabel>
                      <Select
                        labelId="role-label"
                        key={column.accessorKey}
                        label={column.header}
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
                        {cellValueMap.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormGroup>
                  )
                }

                if ((column.accessorKey === 'linked_professor') && (values.role === ROLES.TA)) {
                  return (
                    <FormGroup>
                    <InputLabel id="linked-professor-label">{t('staff.professor-assigned')}</InputLabel>
                    <Select
                      labelId="linked-professor-label"
                      key={column.accessorKey}
                      label={column.header}
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
                      {staffEmails(staffs).map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormGroup>
                  )
                }

                if ((column.accessorKey === 'linked_professor') && (!update || (values.role !== ROLES.TA))) {
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
            <Button
              color="secondary"
              type="submit"
              name="submitForm"
              variant="contained"
            >
              {update ? t('common.Save') : t('common.Create')}
            </Button>
          </DialogActions>
        </form>
          )}
    </Dialog>
  )
}
export default StaffForm
