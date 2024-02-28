import * as React from 'react'
import { Button, Link, Box, Container, CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import styled from 'styled-components'

const theme = createTheme()

const Logo = styled.img`
  width: 100%;
  max-width: 150px;
  margin-bottom: 16px;
`
const Background = styled.div`
  background-image: url('https://www.uottawa.ca/study/sites/g/files/bhrskd296/files/2021-10/20170905-BF-CAMPUS-SCENIC-001.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  display: flex;
  justify-content: center;
  align-items: center;
`
const TopCenterContainer = styled.div`
  position: absolute; // Use absolute positioning to place it relative to the nearest positioned ancestor (or the body if none exists)
  top: 50px; // Align it to the top of the container
  left: 50%; // Start at 50% from the left of the container to center it
  transform: translateX(-50%); // Translate it -50% of its own width to center it accurately
  z-index: 10; // Ensure it's above other elements if necessary
  // Add any additional styling here (e.g., padding, background, etc.)
`
const LeftAlignedContainer = styled.div`
  display: flex;
  justify-content: flex-start; // Aligns content to the start (left)
  align-items: center; // Centers items vertically
  width: 100%; // Adjust width as needed
  padding-left: 10px; // Adds padding on the left
  padding-top: 150px;
  color: white;
  font-size: 50px;
  font-family: 'Helvetica', 'Arial', sans-serif; // 
`
const LoginButtonContainer = styled.div`
  position: fixed; // Fixed or absolute, depending on need. Fixed will keep it in view even on scroll.
  top: 50px; // Align to the top of the viewport
  right: 80px; // Align to the right of the viewport
  padding: 10px; // Add some space around the button for aesthetics
  z-index: 1000; // Ensure it's above other content
`
const FooterContainer = styled.footer`
  background-color: #2c3e50;
  color: #ecf0f1;
  display: flex; // Use flexbox for layout
  justify-content: center; // Center content horizontally
  align-items: center; // Align items vertically
  padding: 20px;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  flex-wrap: nowrap; // Prevent wrapping by default
  font-family: 'Helvetica', 'Arial', sans-serif;
  white-space: nowrap; // Prevent wrapping at the whitespace in the content
  overflow-x: auto; // Allow horizontal scrolling if content is too wide
`
export default function LoginPage () {
  return (
    <ThemeProvider theme={theme}>
      <Background>
        <CssBaseline />
        <TopCenterContainer>
          <Logo src={`${process.env.PUBLIC_URL}/universityofottawalogo.svg`} alt="University of Ottawa Logo" />
        </TopCenterContainer>
        <LoginButtonContainer>
          <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>
            <Link
                href={`${process.env.REACT_APP_BACKEND_HOST}/api/login`}
                type="submit"
                fullWidth
                variant="contained"
                xs={{ mt: 3, mb: 2 }}
            >
              <Button size="large" fullWidth variant="contained" name="login" color="primary">
                Login
              </Button>
            </Link>
          </Box>
        </LoginButtonContainer>
        <Container component="main" maxWidth="xl">
          <LeftAlignedContainer>
            <Container component="main" maxWidth="xl" style={{ padding: '20px', borderRadius: '8px' }}>
              <h1>Academic Team Management</h1>
            </Container>
          </LeftAlignedContainer>
        </Container>
        <FooterContainer>
          {2024} Academic Team Management.
          This project is open source. For contributions, visit our
          <a href='https://github.com/umple/AcademicTeamManagement/wiki' style={{ color: '#3498db', textDecoration: 'none', marginLeft: '5px' }}>
            GitHub repository
          </a>.
        </FooterContainer>
      </Background>
    </ThemeProvider>
  )
}
