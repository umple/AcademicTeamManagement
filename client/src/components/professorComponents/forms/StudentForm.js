import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  TextField,
  DialogActions,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  CircularProgress
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import studentService from '../../../services/studentService'
import Student from '../../../entities/Student'
import studentSchema from '../../../schemas/studentSchema'
import sectionService from '../../../services/sectionService'
import { useTranslation } from 'react-i18next'
import { professorEmail } from '../../../helpers/GetProfessorEmail'

const StudentForm = ({
  open,
  columns,
  setCreateModalOpen,
  fetchStudents,
  students
}) => {
  // Set the translation
  const { t } = useTranslation()

  // retrieve the sections
  const [sections, setSections] = useState([])
  const [isloading, setIsLoading] = useState(false)
  const fetchSections = async () => {
    try {
      const sections = await sectionService.get()
      sections.sections && setSections(sections.sections)
    } catch (error) {
      console.error('Error fetching sections:', error)
    }
  }

  useEffect(() => {
    fetchSections()
  }, [])

  const onSubmit = async (values, actions) => {
    try {
      setIsLoading(true)
      if (values.email) {
        values.email = values.email.toLowerCase()
      }
      await studentService.add(values)
      fetchStudents()
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
      actions.resetForm()
      handleClose()
    }
  }

  const handleClose = () => {
    setCreateModalOpen(false)
  }

  const [initialStudentValues] = useState(
    new Student({
      professorEmail: professorEmail()
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
    initialValues: initialStudentValues.toRequestJSON(),
    validationSchema: studentSchema(students),
    onSubmit
  })
  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">{t('students-table.create-student')}</DialogTitle>
      {isloading
        ? <CircularProgress size={100}></CircularProgress>
        : <form acceptCharset="Enter" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem'
            }}
          >
            {columns.map((column) => {
              if (column.accessorKey === 'sections') {
                return (
                  <FormControl fullWidth>
                    <InputLabel id="section-label">{t('common.Section')}</InputLabel>
                    <Select
                      fullWidth
                      labelId="section-label"
                      defaultValue=""
                      variant="outlined"
                      label="Section"
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
                  </FormControl>
                )
              }
              if (column.accessorKey === 'group') {
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
          <Button color="secondary" type="submit" name="submitForm" variant="contained">
            {t('common.Create')}
          </Button>
        </DialogActions>
      </form> }
    </Dialog>
  )
}
export default StudentForm
