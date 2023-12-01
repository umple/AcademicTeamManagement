import * as React from 'react'
import PropTypes from 'prop-types'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

function CircularProgressWithLabel (props) {
  return (
    <>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          size={100} // Adjust the size as needed
          thickness={2} // Adjust the thickness as needed
          label="Importing Students"
          {...props}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography variant="caption" component="div" color="text.secondary">
            {`${Math.round(props.value)}%`}
          </Typography>
        </Box>
      </Box>
      <Typography
        variant="caption"
        component="div"
        color="text.secondary"
        sx={{ mt: 2 }} // Adjust the margin-top as needed
      >
        Importing students. Please do not close this dialog (may take several
        seconds)...
      </Typography>
    </>
  )
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired
}

export default function CircularWithValueLabel (props) {
  return <CircularProgressWithLabel value={props.progress} />
}
