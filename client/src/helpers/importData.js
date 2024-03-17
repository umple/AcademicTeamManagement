import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Box
  // Select,
  // MenuItem,
  // InputLabel,
  // FormControl,
} from '@mui/material'
import { Button, Typography } from '@material-ui/core'
import CircularWithValueLabel from '../components/common/CircularProgressWithLabel'
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

const ImportData = (props) => {
  const classes = useStyles()
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [isImporting, setIsImporting] = useState(false)

  const { t } = useTranslation()

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
            // props.fetchStudents()
            // props.handleImportSuccess(true)
            // props.closeModal()
            setProgress(0)
            clearInterval(0) // Stop polling
          }
        })
        .catch(() => {
          clearInterval(pollInterval) // Stop polling on error
        })
    }, 500) // Poll every 1 second (adjust as needed)

    const reader = new FileReader()
    var fileContents = {}
    reader.onload = function (event) {
      const result = event.target.result
      fileContents = JSON.parse(result)

      console.log(fileContents.students)
      clearInterval(pollInterval) // ERASE THIS WHEN API REQUEST IMPLEMENTED

      // IMPLEMENT NEW GLOBAL EXPORT CALL IN THE API (CONTROLLERS/STUDENT_CONTROLLER)
      // THAT ACCEPTS JSON AS PAYLOAD. DEPRECATE IMPORT STUDENT CALL
    }

    reader.readAsText(file)

    // const studentData = new FormData()
    // studentData.append('file', file)
    // studentData.append('column', JSON.stringify(props.students.columns))
    // studentData.append('sections', section)
    // fetch('api/importStudent', {
    //   method: 'POST',
    //   body: studentData
    // })
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error('Network response not ok')
    //     }
    //     return response.json()
    //   })
    //   .then(() => {
    //     clearInterval(pollInterval)
    //     setIsImporting(false)
    //   })
  }

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
      {isImporting
        ? (
        <CircularWithValueLabel progress={progress} />
          )
        : (
        <form acceptCharset="Enter" onSubmit={handleSubmit} className={classes.container}>
          {file
            ? (
            <Box className={classes.fileBox}>
              {/* <CloudDoneIcon sx={{ fontSize: '4rem', color: '#999' }} /> */}
              <Box sx={{ mt: '1rem' }}>
                <strong>{file.name}</strong>
              </Box>

              <Button
                variant="contained"
                type="submit"
                color="primary"
                className={classes.uploadButton}
              >
                {t('common.Submit')}
              </Button>
            </Box>
              )
            : (
            <Box
              // className={`${classes.fileBox} ${
                // isDragActive ? classes.dropAreaActive : ''
              // }`}
              sx={{ width: 600 }}
              // onDragEnter={handleDragEnter}
              // onDragOver={handleDragEnter}
              // onDragLeave={handleDragLeave}
              // onDrop={handleDrop}
            >
              <Box my={5} className={classes.fileBox}>
                {/* <CloudUploadIcon sx={{ fontSize: '4rem', color: '#999' }} /> */}
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
            </Box>
              )}
        </form>
          )}
    </Box>
  )
}

export default ImportData
