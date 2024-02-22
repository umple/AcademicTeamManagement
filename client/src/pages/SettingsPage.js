import * as React from 'react'
import { Button, Link, Box, Container, CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import styled from 'styled-components'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { handleGlobalExportData } from '../helpers/exportData'

const theme = createTheme()

const WhiteContainer = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`

export default function SettingsPage () {
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <WhiteContainer>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Button
              color="primary"
              onClick={() => handleGlobalExportData()}
              startIcon={<FileDownloadIcon />}
              variant="contained"
            >
              Export
            </Button>
            <Link
              href={`${process.env.REACT_APP_BACKEND_HOST}/api/login`}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              <Button size="large" fullWidth variant="contained" name="login" color="primary">
                Export
              </Button>
            </Link>
          </Box>
        </WhiteContainer>
      </Container>
    </ThemeProvider>
  )
}
