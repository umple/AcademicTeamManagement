import AdbIcon from '@mui/icons-material/Adb';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearCachedUserEmail } from "../../../helpers/UserEmail";
import { clearCachedUserType } from '../../../helpers/UserType';
import {getUserType} from '../../../helpers/UserType';
import { clearCachedUserName } from '../../../helpers/UserName';
import './ResponsiveAppBar.css';

// Nav elements to display for the students
const studentPages = {
  page1: {key: 'Home', value:'/StudentHome'},
  page2: {key: 'Projects', value:'/StudentProjects'},
  page3: {key: 'Groups', value:'/StudentGroups'},
  page4: {key: 'My Group', value:'/MyGroup'},
};

// Nav elements to display for the professor
const professorPages = {
  page1: {key: 'Home', value:'/ProfessorHome'},
  page2: {key: 'Projects', value:'/Projects'},
  page3: {key:'Groups', value:'/GroupView'},
  page4: {key: 'Students', value:'/Students'},
};


const ResponsiveAppBar = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    getUserType()
      .then((type) => {
        setUserType(type)
        if (type) {
          setIsAuthenticated(true)
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userType]);

  // set the nav elements according to the user type
  let pages = {};

  // Check user type to assign navbar elements
  switch (userType) {
    case 'student':
      pages = studentPages;
      break;

    case 'professor':
      pages = professorPages;
      break;

    default:
      break;
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = () => {
    clearCachedUserType();
    clearCachedUserName();
    clearCachedUserEmail();
    setAnchorElNav(null);
  }

  const handleLogIn = () => {
    navigate('/');
  }

  // don't show navbar on the login page
  if (location.pathname === "/login" || location.pathname === "/") {
    return null;
  }

  return (
   
      <AppBar sx={{ bgcolor: '#8f001a'}}>
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
                  <MenuItem key={key} component="a" href={value.value} onClick={handleCloseNavMenu}>
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
                  key={key}  
                  href={value.value}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {pages[key].key}
                </Button >
                ))}
            </Box>
            {
              isAuthenticated ? 
                <Button
                  href={`${process.env.REACT_APP_BACKEND_HOST}/api/logout`}
                  onClick={handleLogout}
                  variant="outlined"
                  endIcon={<LogoutIcon/>}
                  sx={{ my: 2, color: 'white', borderColor: 'white' }}
                  >Log out
                </Button> 
                : 
                <Button
                  onClick={handleLogIn}
                  variant="outlined"
                  endIcon={<LoginIcon/>}
                  sx={{ my: 2, color: 'white', borderColor: 'white' }}
                  >Log In
                </Button> 
            }
          </Toolbar>
      </AppBar>

  );
}
export default ResponsiveAppBar;