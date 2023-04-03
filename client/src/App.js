import './App.css';
import ResponsiveAppBar from './StaticComponents/NavBar/ResponsiveAppBar';
import ProjectTable from './ProjectListingView/Components/ProjectTable/ProjectTable';
import StudentTable from './StudentListingView/StudentTable';
import ImportStudents from './ImportStudentsView/ImportStudents';
import Groups from './GroupView/GroupTable'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoginPage from './LoginView/LoginPage';
import HomePage from './HomePageView/HomePage';
import axios from 'axios';
import StudentHomePage from './HomePageView/StudentHomePage';
import StudentProjects from './StudentView/StudentProjects';
import StudentGroups from './StudentView/StudentGroupTable';
import MyGroup from './StudentView/MyGroup';


const [user, setUser] = useState(null);

const handleAuthentication = async () => {
  try {
    // Call the API to complete the OAuth2 flow
    const response = await axios.post('http://localhost:5001/api/login', { url: window.location.href }); // proxy is not working for some reason
    const { access_token } = response.data;

    // Decode the JWT to get the user's roles
    const decodedToken = JSON.parse(atob(access_token.split('.')[1]));
    const roles = decodedToken.roles;

    // Set the user based on their role and redirect
    if (roles.includes('professor')) {
      setUser({ role: 'professor' });
      window.location.replace('/'); // professor view
    } else if (roles.includes('student')) {
      setUser({ role: 'student' });
      window.location.replace('/StudentHome'); // student view
    } else {
      throw new Error('Invalid user role');
    }
  } catch (error) {
    console.error(error);
    setUser(null);
  }
};

const App = () => {

  // Check for a redirect from the OAuth2 flow
  if (window.location.search.includes('code=')) {
    handleAuthentication(setUser);
  }

  return (
    <Router>
      <div>
        <div className="App">
          <div id="nav">
            <ResponsiveAppBar></ResponsiveAppBar>
          </div>
          <Routes>
            <Route path='/' element={<HomePage/>}></Route>
            <Route path='/login' element={<LoginPage/>}></Route>
            <Route exact path='/Projects' element={<ProjectTable/>}></Route>
            <Route path='/ImportStudents' element={<ImportStudents/>}></Route>
            <Route path='/Students' element={<StudentTable/>}></Route>
            <Route path='/GroupView' element={<Groups/>}></Route>
            <Route path='/StudentHome' element={<StudentHomePage/>}></Route>
            <Route path='/StudentProjects' element={<StudentProjects/>}></Route>
            <Route path='/StudentGroups' element={<StudentGroups/>}></Route>
            <Route path='/MyGroup' element={<MyGroup/>}></Route>
          </Routes >

           
        </div>
      </div>
    </Router>

  );
}

export default App;
