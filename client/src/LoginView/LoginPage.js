import * as React from 'react';
import { Avatar, Button, Link, Box, Typography, Container, CssBaseline } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

export default function LoginPage() {
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
  
            <Link
              type="submit"
              fullWidth
              variant="contained"
              href ="http://localhost:5000/login"
              sx={{ mt: 3, mb: 2 }}
            >
              <Button size='large' variant="outlined" startIcon={<AccountBalanceIcon />}>
                University of Ottawa
              </Button>
            </Link>
   
          </Box>
        </Box>
 
      </Container>
    </ThemeProvider>
  );
}

 