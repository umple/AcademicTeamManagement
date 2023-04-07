import React, { useState, useEffect } from 'react';
import './ResponsiveAppBar.css';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, MenuItem} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';
import { useLocation } from 'react-router-dom';
import { Button } from '@mui/material';

// Nav elements to display for the students
const studentPages = {
  page1: {key: 'Home', value:'/StudentHome'},
  page2: {key: 'Projects', value:'/StudentProjects'},
  page3: {key: 'Groups', value:'/StudentGroups'},
  page4: {key: 'My Group', value:'/MyGroup'},
};

// Nav elements to display for the professor
const professorPages = {
  page1: {key: 'Home', value:'/'},
  page2: {key: 'Projects', value:'/Projects'},
  page3: {key:'Groups', value:'/GroupView'},
  page4: {key: 'Students', value:'/Students'},
};


const ResponsiveAppBar = () => {

  const location = useLocation();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [isStudent, setIsStudent] = useState(true); // By default, we set the user to Student

  useEffect(() => {
    // Get user type information from the /getusertype endpoint
    fetch(`http://localhost:${process.env.REACT_APP_FLASK}/getusertype`, {
      method: 'GET',
      credentials: 'include' // include cookies in the request
    })
      .then(response => response.json())
      .then(data => {
        if (data.userType) setIsStudent(data.userType === 'student');
      });
  }, [setIsStudent])

  // set the nav elements according to the user type
  const pages = isStudent ? studentPages : professorPages;

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // don't show navbar on the login page
  if (location.pathname === "/login") {
    return null;
  }
 

  return (
   
      <AppBar sx={{ bgcolor: '#8f001a'}}>
        {/* <Container id="m" maxWidth="xl"> */}
          <Toolbar style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                textTransform: 'none'
              }}
            >
               
            </Typography>

            {/* fluid menu options */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none'} }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {Object.entries(pages).map(([key,value]) => (
                  <MenuItem key={key} onClick={handleCloseNavMenu}>
                    <Typography  style={{ textTransform: "none" }} textAlign="center">{pages[key].key}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                textTransform: 'none'
              }}
            >
              LOGO
            </Typography>


            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {Object.entries(pages).map(([key,value]) => (
                <Button  
                  href={value.value}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {pages[key].key}
                </Button >
                ))}
            </Box>

            
          </Toolbar>
        {/* </Container> */}
      </AppBar>

  );
}
export default ResponsiveAppBar;