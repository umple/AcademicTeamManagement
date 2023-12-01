import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme) => ({
  input: {
    display: 'none'
  },
  dialogTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '& h2': {
      fontWeight: 'bold'
    }
  },
  closeButton: {
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  modalContent: {
    padding: theme.spacing(2)
  }
}))
