import * as React from 'react'
import { Button, Link, Box, Container, CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import styled from 'styled-components'
import Footer from '../components/common/Footer'

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
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
`
const LeftAlignedContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding-left: 10px;
  padding-top: 150px;
  color: white;
  font-size: 50px;
  font-family: 'Helvetica', 'Arial', sans-serif;
`
const LoginButtonContainer = styled.div`
  position: fixed;
  top: 50px;
  right: 80px;
  padding: 10px;
  z-index: 1000;
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
        <Footer/>
      </Background>
    </ThemeProvider>
  )
}
