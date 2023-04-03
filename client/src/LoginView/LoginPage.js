import * as React from 'react';
import { Avatar, Button, Link, Box, Typography, Container, CssBaseline } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useState } from 'react';

const theme = createTheme();

export default function LoginPage() {

  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Call the API to initiate the OAuth2 flow
      const response = await axios({
        method: 'get',
        url:`http://localhost:${process.env.REACT_APP_FLASK}/api/login`
      })

      window.location.replace(response.data);
    } catch (error) {
      setError('Failed to initiate login');
    } finally {
      setLoading(false);
    }
  };


  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Choose Your Institution to Login
          </Typography>

          <Box component="form" noValidate sx={{ mt: 1 }}>
              <Button 
                size='large' 
                variant="outlined" 
                startIcon={<AccountBalanceIcon />}
                onclick={handleLogin()}
                >University of Ottawa
              </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}