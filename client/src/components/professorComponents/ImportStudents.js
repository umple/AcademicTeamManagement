import { React, useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Link
} from '@mui/material'
import { Button, Typography } from '@material-ui/core'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CloudDoneIcon from '@mui/icons-material/CloudDone'
import sectionService from '../../services/sectionService'
import CircularWithValueLabel from '../common/CircularProgressWithLabel'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme) => ({
  input: {
    display: 'none'
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  fileBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '2px dashed #ccc',
    borderRadius: '4px',
    padding: '2rem',
    width: '80%'
  },
  uploadButton: {
    marginTop: '2rem',
    fontSize: '1.2rem'
  },
  submitButton: {
    marginTop: '2rem',
    alignSelf: 'flex-end',
    fontSize: '1.2rem'
  },
  // Add specific style for the drop area
  dropArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '2px dashed #ccc',
    borderRadius: '4px',
    padding: '2rem',
    width: '80%',
    cursor: 'pointer',
    backgroundColor: '#f9f9f9'
  },

  // Add style for highlighting the drop area when a file is dragged over it
  dropAreaActive: {
    backgroundColor: '#e0e0e0'
  }
}))

const ImportStudents = (props) => {
  const classes = useStyles()
  const [file, setFile] = useState(null)
  const [section, setSection] = useState('')
  const [isDragActive, setIsDragActive] = useState(false) // State to track if a file is being dragged over the drop area
  const [progress, setProgress] = useState(0)
  const [isImporting, setIsImporting] = useState(false)

  // Set the translation
  const { t } = useTranslation()

  const handleDragEnter = (event) => {
    event.preventDefault()
    setIsDragActive(true)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    setIsDragActive(false)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragActive(false)
    setFile(event.dataTransfer.files[0])
  }

  const handleChange = (event) => {
    setFile(event.target.files[0])
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsImporting(true)
    if (!file) {
      return
    }

    const pollInterval = setInterval(() => {
      fetch('api/getTime/completion')
        .then((response) => response.json())
        .then((data) => {
          setProgress(data.completion_percentage)
          // Check if the task is completed
          if (data.completion_percentage === 100) {
            // Additional logic when the task is completed
            // For example, you can fetch the updated data or display a completion message
            props.fetchStudents()
            props.handleImportSuccess(true)
            props.closeModal()
            setProgress(0)
            clearInterval(0) // Stop polling
          }
        })
        .catch(() => {
          clearInterval(pollInterval) // Stop polling on error
        })
    }, 500) // Poll every 1 second (adjust as needed)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('column', JSON.stringify(props.columns))
    formData.append('sections', section)
    fetch('api/importStudent', {
      method: 'POST',
      body: formData
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(() => {
        props.fetchStudents()
        props.handleImportSuccess(true)
        props.closeModal()
        clearInterval(pollInterval)
        setIsImporting(false)
      })
      .catch(() => {
        clearInterval(pollInterval)
        setIsImporting(false)
      })
  }

  const [sections, setSections] = useState([])

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

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '30px',
        width: 500
      }}
    >
      <Typography variant="h6" gutterBottom>
        {t('students-table.imports-instructions')}
      </Typography>
      <FormControl fullWidth>
        <InputLabel id="section-select-label">{t('table.sections')}</InputLabel>
        <Select
          fullWidth
          defaultValue=""
          labelId="section-select-label"
          name="section"
          label="Section"
          variant="outlined"
          id="select-section"
          onChange={(e) => setSection(e.target.value)}
        >
          {sections.map((option) => (
            <MenuItem key={option.name} value={option.name}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <br></br>
      {isImporting
        ? (
        <CircularWithValueLabel progress={progress} />
          )
        : (
        <form acceptCharset="Enter" onSubmit={handleSubmit} className={classes.container}>
          {file
            ? (
            <Box className={classes.fileBox}>
              <CloudDoneIcon sx={{ fontSize: '4rem', color: '#999' }} />
              <Box sx={{ mt: '1rem' }}>
                <strong>{file.name}</strong>
              </Box>

              <Button
                variant="contained"
                type="submit"
                disabled={!section}
                color="primary"
                className={classes.uploadButton}
              >
                {t('common.Submit')}
              </Button>
            </Box>
              )
            : (
            <Box
              className={`${classes.fileBox} ${
                isDragActive ? classes.dropAreaActive : ''
              }`}
              sx={{ width: 600 }}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <p style={{ fontWeight: 'bold' }}>{t('students-table.expected-template')}:</p>
              <iframe
                title="student import"
                style={{ height: 100, width: '100%' }}
                src="assets/student_import_template.html"
              ></iframe>
              <Box mt={2}>
                <Link
                  href="https://github.com/umple/AcademicTeamManagement/blob/main/docs/information/CreatingClassList.md"
                  underline="always"
                  target="_blank"
                  rel="noopener"
                >
                  {t('common.learn-more')}: {t('students-table.creating-list')}
                </Link>
              </Box>
              <Box my={5} className={classes.fileBox}>
                <CloudUploadIcon sx={{ fontSize: '4rem', color: '#999' }} />
                <Typography>{t('students-table.drag-drop')}</Typography>
                <input
                  accept="*"
                  htmlFor="input-file-upload"
                  className={classes.input}
                  id="contained-button-file"
                  type="file"
                  onChange={handleChange}
                />
              </Box>
              <label
                htmlFor="contained-button-file"
                className={classes.buttonLabel}
              >
                <Button variant="contained" color="warning" component="span">
                  {t('students-table.browse-files')}
                </Button>
              </label>
              <br></br>
              <label>
                <Button sx={{ m: 2 }} color="primary" variant="contained">
                  <a
                    style={{ all: 'unset' }}
                    href="assets/student_import_template.xlsx"
                  >
                    {t('students-table.download-template')}
                  </a>
                </Button>
              </label>
            </Box>
              )}
        </form>
          )}
    </Box>
  )
}

export default ImportStudents
