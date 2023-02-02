import './App.css';
import ResponsiveAppBar from './StaticComponents/NavBar/ResponsiveAppBar';
import ProjectTable from './ProjectListingView/Components/ProjectTable/ProjectTable';
import ImportStudents from './ImportStudentsView/ImportStudents';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <div className="App">
          <div id="nav">
            <ResponsiveAppBar></ResponsiveAppBar>
          </div>
          <Routes >
            <Route exact path='/Projects' element={<ProjectTable/>}></Route>
            <Route path='/ImportStudents' element={<ImportStudents/>}></Route>
          </Routes >

           
        </div>
      </div>
    </Router>

  );
}

export default App;
