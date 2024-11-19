import React, { useEffect } from 'react' // Import useEffect
import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom'
import './App.css'
import { RefreshProvider } from './contexts/RefreshContext'
import PrivateRoutes from './Authentication/PrivateRoutes'
import RoleBasedRoutes from './Authentication/RoleBasedRoutes'
import ResponsiveAppBar from './components/StaticComponents/NavBar/ResponsiveAppBar'
import PageNotFound from './components/StaticComponents/PageNotFound/PageNotFound'
import { ROLES } from './helpers/Roles'
import { getUserEmail } from './helpers/UserEmail'

// login page
import LoginPage from './pages/LoginPage'

// Admin pages
import AdminHomePage from './pages/adminPages/AdminHomePage'
import AdminStaffPage from './pages/adminPages/AdminStaffPage'

// Professor pages
import HomePage from './pages/professorPages/HomePage'
import ProfessorGroupPage from './pages/professorPages/ProfessorGroupPage'
import ProfessorProjectPage from './pages/professorPages/ProfessorProjectPage'
import ProfessorStudentPage from './pages/professorPages/ProfessorStudentPage'
import ProfessorSectionPage from './pages/professorPages/ProfessorSectionPage'

// Student pages
import StudentGroupsPage from './pages/studentPages/StudentGroupsPage'
import StudentHomePage from './pages/studentPages/StudentHomePage'
import StudentMyGroupPage from './pages/studentPages/StudentMyGroupPage'
import StudentProjectPage from './pages/studentPages/StudentProjectPage'

// Settings page
import SettingsPage from './pages/SettingsPage'

const App = () => {
  useEffect(() => {
    // Fetch user email once the app loads
    const fetchUserEmail = async () => {
      try {
        const email = await getUserEmail()
        console.log('Fetched user email after app load:', email)
      } catch (error) {
        console.error('Error fetching user email on app load:', error)
      }
    }

    fetchUserEmail()
  }, [])
  return (
    <RefreshProvider>
    <Router>
      <div>
        <div className="App">
          <div id="nav">
            <ResponsiveAppBar></ResponsiveAppBar>
          </div>
          <Routes>
            <Route element={<PrivateRoutes />}>

              <Route element={<RoleBasedRoutes allowedRole={ROLES.ADMIN} />}>
                <Route path="/AdminHome" element={<AdminHomePage />}></Route>
                <Route path="/AdminStudents" element={<ProfessorStudentPage />}></Route>
                <Route exact path="/AdminProjects" element={<ProfessorProjectPage />}></Route>
                <Route path="/AdminGroupView" element={<ProfessorGroupPage />}></Route>
                <Route path="/AdminSections" element={<ProfessorSectionPage />}></Route>
                <Route path="/AdminStaff" element={<AdminStaffPage />}></Route>
                <Route path="/Settings" element={<SettingsPage />}></Route>
                <Route path="/ProfessorHome" element={<Navigate to="/AdminHome" />}></Route>
              </Route>

              <Route element={<RoleBasedRoutes allowedRole={ROLES.PROFESSOR} />}>
                <Route path="/ProfessorHome" element={<HomePage />}></Route>
                <Route path="/Students" element={<ProfessorStudentPage />}></Route>
                <Route exact path="/Projects" element={<ProfessorProjectPage />}></Route>
                <Route path="/GroupView" element={<ProfessorGroupPage />}></Route>
                <Route path="/Sections" element={<ProfessorSectionPage />}></Route>
              </Route>

              <Route element={<RoleBasedRoutes allowedRole={ROLES.TA} />}>
                <Route path="/HomeTA" element={<HomePage />}></Route>
                <Route path="/StudentsTA" element={<ProfessorStudentPage />}></Route>
                <Route exact path="/ProjectsTA" element={<ProfessorProjectPage />}></Route>
                <Route path="/GroupViewTA" element={<ProfessorGroupPage />}></Route>
                <Route path="/SectionsTA" element={<ProfessorSectionPage />}></Route>
              </Route>

              <Route element={<RoleBasedRoutes allowedRole={ROLES.STUDENT} />}>
                <Route path="/StudentHome" element={<StudentHomePage />}></Route>
                <Route path="/StudentProjects" element={<StudentProjectPage />}></Route>
                <Route path="/StudentGroups" element={<StudentGroupsPage />}></Route>
                <Route path="/MyGroup" element={<StudentMyGroupPage/>}></Route>
              </Route>

            </Route>

            <Route path="/" element={<LoginPage />}></Route>
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
    </RefreshProvider>
  )
}

export default App
