import React, { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormGroup,
  Select,
  MenuItem,
  InputLabel,
  Stack,
  TextField
} from '@mui/material'
import { useTranslation } from 'react-i18next'

const ViewApplicationModal = ({
  open,
  data,
  onClose,
  onSubmit,
  setShowAlert,
  fetchApplications
}) => {
  const [textFieldFeedback, setTextFieldtextFieldFeedback] = useState(data.feedback ?? '')
  const [status, setStatus] = useState(data.status && data.status !== 'Requested' ? data.status : 'Feedback Provided')
  const { t } = useTranslation()

  const states = ['Accepted', 'Rejected', 'Feedback Provided']

  const handleStatusChange = (e) => {
    setStatus(e.target.value)
  }

  const handleDeleteApplication = (e) => {
    e.preventDefault()
    fetch(`api/application/delete/${data._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        return response.json()
      })
      .then(() => {
        fetchApplications()
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 5000)
      })
    onClose()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    data.status = status
    data.feedback = textFieldFeedback
    fetch('api/application/review', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        return response.json()
      })
      .then(() => {
        fetchApplications()
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 5000)
      })
    onSubmit()
    onClose()
  }

  return (
      <Dialog open={open}>
        <DialogTitle textAlign="center">{t('project.project-applications')}</DialogTitle>
        <form acceptCharset="Enter" onSubmit={handleSubmit}>
          <DialogContent>
            <Stack
              sx={{
                width: '100%',
                minWidth: { xs: '300px', sm: '360px', md: '400px' },
                gap: '1.5rem'
              }}
            >
              <Box>
                <InputLabel id="group-label">{t('common.Group')}</InputLabel>
                <TextField
                  disabled
                  fullWidth
                  name={'group_id'}
                  value={data.group_id}
                  rows={1}
                />
              </Box>
              <Box>
                <InputLabel id="submitted-by-label">{t('project.submitted-by')}</InputLabel>
                <TextField
                  disabled
                  fullWidth
                  name={'submitted_by'}
                  value={data.submitted_by}
                  rows={1}
                />
              </Box>
              <Box>
                <InputLabel id="submitted-by-label">{t('project.ranking')}</InputLabel>
                <TextField
                  disabled
                  fullWidth
                  name={'ranking'}
                  value={data.ranking}
                  rows={1}
                />
              </Box>
              <FormGroup>
                <InputLabel id="status-label">{t('project.status')}</InputLabel>
                <Select
                    labelId="status-label"
                    defaultValue={status}
                    disabled={data.status === 'Accepted'}
                    onChange={handleStatusChange}>
                  {states.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </Select>
              </FormGroup>
              <Box>
                <InputLabel id="feedback-label">{t('project.feedback')}</InputLabel>
                <TextField
                  name={'feedback'}
                  multiline
                  fullWidth
                  rows={5}
                  placeholder="Insert Feedback Here"
                  defaultValue={textFieldFeedback}
                  value={textFieldFeedback}
                  onChange={(e) => {
                    setTextFieldtextFieldFeedback(e.target.value)
                  }}
                />
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: '1.25rem', justifyContent: 'space-between' }}>
            <Button
              color="error"
              sx={{ marginLeft: '0' }}
              onClick={handleDeleteApplication}
            >
              {t('common.Delete')}
            </Button>
            <Box>
              <Button onClick={onClose}>{t('common.Cancel')}</Button>
              <Button
                color="secondary"
                type="submit"
                onClick={handleSubmit}
                variant="contained"
              >
                {t('common.Save')}
              </Button>
            </Box>
          </DialogActions>
        </form>
      </Dialog>
  )
}
export default ViewApplicationModal
