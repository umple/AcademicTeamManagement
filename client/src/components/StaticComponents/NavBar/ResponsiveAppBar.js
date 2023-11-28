import AdbIcon from '@mui/icons-material/Adb'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import LanguageIcon from '@mui/icons-material/Language'
import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { clearCachedUserEmail } from '../../../helpers/UserEmail'
import { clearCachedUserType, getUserType } from '../../../helpers/UserType'

import { clearCachedUserName } from '../../../helpers/UserName'
import './ResponsiveAppBar.css'

const ResponsiveAppBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [anchorElNav, setAnchorElNav] = useState(null)
  const [userType, setUserType] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // code for internationalization
  const { t, i18n } = useTranslation()
  const defaultLanguage = 'en'
  const [currentLanguage, setCurrentLanguage] = useState(localStorage.getItem('preferredLanguage') ?? defaultLanguage)

  useEffect(() => {
    const newLang = localStorage.getItem('preferredLanguage')

    if (newLang) {
      i18n.changeLanguage(newLang)
    } else {
      i18n.changeLanguage(defaultLanguage)
    }
  }, [])

  const changeLanguage = () => {
    if (currentLanguage == 'en') {
      setCurrentLanguage('fr')
      i18n.changeLanguage('fr')
      localStorage.setItem('preferredLanguage', 'fr')
    } else {
      setCurrentLanguage('en')
      i18n.changeLanguage('en')
      localStorage.setItem('preferredLanguage', 'en')
    }
  }

  // Nav elements to display for the students
  const studentPages = {
    page1: { key: t('header.navbar.home'), value: '/StudentHome' },
    page2: { key: t('header.navbar.projects'), value: '/StudentProjects' },
    page3: { key: t('header.navbar.groups'), value: '/StudentGroups' },
    page4: { key: t('header.navbar.my-group'), value: '/MyGroup' }
  }

  // Nav elements to display for the professor
  const professorPages = {
    page1: { key: t('header.navbar.home'), value: '/ProfessorHome' },
    page2: { key: t('header.navbar.projects'), value: '/Projects' },
    page3: { key: t('header.navbar.groups'), value: '/GroupView' },
    page4: { key: t('header.navbar.students'), value: '/Students' },
    page5: { key: t('header.navbar.sections'), value: '/Sections' }
  }

  // Nav elements to display for the admin
  const adminPages = {
    page1: { key: t('header.navbar.home'), value: '/AdminHome' },
    page2: { key: t('header.navbar.projects'), value: '/AdminProjects' },
    page3: { key: t('header.navbar.groups'), value: '/AdminGroupView' },
    page4: { key: t('header.navbar.students'), value: '/AdminStudents' },
    page5: { key: t('header.navbar.sections'), value: '/AdminSections' },
    page7: { key: t('header.navbar.staff'), value: '/AdminStaff' }
  }

  useEffect(() => {
    getUserType()
      .then((type) => {
        setUserType(type)
        if (type) {
          setIsAuthenticated(true)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }, [userType])

  // set the nav elements according to the user type
  let pages = {}

  // Check user type to assign navbar elements
  switch (userType) {
    case 'student':
      pages = studentPages
      break

    case 'professor':
      pages = professorPages
      break

    case 'admin':
      pages = adminPages
      break

    default:
      break
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleLogout = () => {
    clearCachedUserType()
    clearCachedUserName()
    clearCachedUserEmail()
    setAnchorElNav(null)
  }

  const handleLogIn = () => {
    navigate('/')
  }

  // don't show navbar on the login page
  if (location.pathname === '/login' || location.pathname === '/') {
    return null
  }

  return (

      <AppBar sx={{ bgcolor: '#8f001a' }}>
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
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
                  horizontal: 'left'
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left'
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' }
                }}
              >
                {Object.entries(pages).map(([key, value]) => (
                  <MenuItem key={key} component="a" href={value.value} onClick={handleCloseNavMenu}>
                    <Typography style={{ textTransform: 'none' }} textAlign="center">{pages[key].key}</Typography>
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
              ATM
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {Object.entries(pages).map(([key, value]) => (
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
            <Button
              onClick={changeLanguage}
              endIcon={<LanguageIcon style={{ fontSize: 35 }}/>}
              sx={{ mr: 2, color: 'white', borderColor: 'white' }}
            ></Button>
            {
              isAuthenticated
                ? <Button
                  href={`${process.env.REACT_APP_BACKEND_HOST}/api/logout`}
                  onClick={handleLogout}
                  variant="outlined"
                  endIcon={<LogoutIcon/>}
                  sx={{ my: 2, color: 'white', borderColor: 'white' }}
                  >{t('common.log-out')}
                </Button>
                : <Button
                  onClick={handleLogIn}
                  variant="outlined"
                  endIcon={<LoginIcon/>}
                  sx={{ my: 2, color: 'white', borderColor: 'white' }}
                  >{t('common.log-in')}
                </Button>
            }
          </Toolbar>
      </AppBar>

  )
}
export default ResponsiveAppBar
