// Imports
import React from 'react'
import {
  makeStyles,
  Grid,
  Typography
} from '@material-ui/core'

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(4),
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: '4rem',
    fontWeight: 700
  },
  column1: {
    paddingLeft: 50
  },
  ErrorDescription: {
    fontSize: '2rem',
    fontWeight: 500,
    color: '#616161'
  }
}))

// PageNotFound Component
const PageNotFound = () => {
  const classes = useStyles()

  return (
      <div className={classes.root}>
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          <Grid item sm={6} className={classes.column1}>
            <Typography variant="h3" className={classes.title} gutterBottom>
              Page Not Found
            </Typography>
            <Typography variant="h1" className={classes.ErrorDescription} gutterBottom>
                Make sure that you are in the correct path
            </Typography>
          </Grid>
        </Grid>
      </div>
  )
}

export default PageNotFound
