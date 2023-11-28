import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { useTranslation } from 'react-i18next'

const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const ConfirmDeletionModal = ({
  open,
  setOpen,
  handleDeletion,
  row,
  type
}) => {
  // Set the translation
  const { t } = useTranslation()

  const handleClose = () => {
    setOpen(false)
  }
  const dialogId = type !== 'bulk' ? `dialog-${row.id}` : 'bulk'

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        className="modal-dialog"
        onClose={handleClose}
        aria-describedby={`alert-dialog-slide-description-${dialogId}`} // Use a unique aria-describedby
      >
        <DialogTitle>
          {type === 'group'
            ? (
            <span>{t('deletion-modal.delete-group')}</span>
              )
            : type === 'project'
              ? (
            <span>{t('deletion-modal.delete-project')}</span>
                )
              : type === 'student'
                ? (
            <span>{t('deletion-modal.delete-student')}</span>
                  )
                : type === 'section'
                  ? (
            <span>{t('deletion-modal.delete-section')}</span>
                    )
                  : type === 'staff'
                    ? (
            <span>{t('deletion-modal.delete-staff')}</span>
                      )
                    : type === 'bulk'
                      ? (
            <span>{t('deletion-modal.delete-bulk-students')}</span>
                        )
                      : null}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {type === 'group'
              ? (
              <span>{t('common.Group')}: {row.getValue('group_id')}</span>
                )
              : type === 'project'
                ? (
              <span>{t('common.Project')}: {row.getValue('project')}</span>
                  )
                : type === 'student'
                  ? (
              <span>{t('common.Student')}: {row.getValue('username')}</span>
                    )
                  : type === 'staff'
                    ? (
              <span>{t('common.Staff')}: {row.getValue('username')}</span>
                      )
                    : type === 'section'
                      ? (
              <span>{t('common.Section')}: {row.getValue('name')}</span>
                        )
                      : type === 'bulk'
                        ? (
              <span>{t('deletion-modal.total-students-selected')}: {Object.keys(row).length}</span>
                          )
                        : null}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('common.Disagree')}</Button>
          <Button
            name="agreeToDelete"
            onClick={() => {
              handleDeletion(row)
            }}
          >
            {t('common.Agree')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ConfirmDeletionModal
