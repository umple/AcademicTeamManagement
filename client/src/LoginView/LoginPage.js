import * as React from 'react';
import { Avatar, Button, Link, Box, Typography, Container, CssBaseline } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styled from 'styled-components';

const theme = createTheme();

const Logo = styled.img`
  width: 100%;
  max-width: 200px;
  margin-bottom: 16px;
`;

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
`;

const WhiteContainer = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export default function LoginPage() {
  return (
    <ThemeProvider theme={theme}>
      <Background>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <WhiteContainer>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Logo src="https://www.uottawa.ca/brand/sites/www.uottawa.ca.brand/files/4_2_0_horizontal_logo.png" alt="Company Logo" />
              <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>
                <Link
                  href={`${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_FLASK}/api/login`}
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  <Button size="large" fullWidth variant="contained" color="primary">
                    Login
                  </Button>
                </Link>
              </Box>
            </Box>
          </WhiteContainer>
        </Container>
      </Background>
    </ThemeProvider>
  );
}
