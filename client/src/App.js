import './App.css';
import ResponsiveAppBar from './StaticComponents/NavBar/ResponsiveAppBar';
import ProjectTable from './ProjectListingView/Components/ProjectTable/ProjectTable';
import StudentTable from './StudentListingView/StudentTable';
import ImportStudents from './ImportStudentsView/ImportStudents';
import Groups from './GroupView/GroupTable'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginView/LoginPage';
import HomePage from './HomePageView/HomePage';

function App() {
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
          </Routes >

           
        </div>
      </div>
    </Router>

  );
}

export default App;
