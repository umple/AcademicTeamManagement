import * as React from 'react'
import { Button, Box, Container, CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import styled from 'styled-components'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import { ExportToCsv } from 'export-to-csv'
import { csvOptions, handleGlobalExportData } from '../helpers/exportData'
import ImportData from '../helpers/importData'

const theme = createTheme()
const csvExporter = new ExportToCsv(csvOptions('AcademicTeamsExport-'))

const WhiteContainer = styled.div`
  margin-top: 50px;
  background-color: white;
  padding: 0 40px 40px 40px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`

export default function SettingsPage () {
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <WhiteContainer>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'auto'
            }}
          >
            <h2 style={{ Align: 'left' }}>Data protection</h2>
            <Button
              color="primary"
              onClick={() => handleGlobalExportData(csvExporter)}
              startIcon={<FileDownloadIcon />}
              variant="contained"
            >
              Export data as JSON
            </Button>
            <Button
              color="primary"
              style={{ marginTop: '10px' }}
              onClick={() => handleGlobalExportData(csvExporter)}
              startIcon={<FileUploadIcon />}
              variant="contained"
            >
              Import JSON data (WARNING: THIS WILL OVERWRITE ALL DATA)
            </Button>
            <ImportData/>
          </Box>
        </WhiteContainer>
      </Container>
    </ThemeProvider>
  )
}
