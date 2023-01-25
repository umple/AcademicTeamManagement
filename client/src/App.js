import ResponsiveAppBar from './StaticComponents/NavBar/ResponsiveAppBar';
import './App.css';
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
            <Route exact path='/' element={<ImportStudents/>}></Route>
            <Route path='/ImportStudentsView' element={<ImportStudents/>}></Route>
          </Routes >

           
        </div>
      </div>
    </Router>

  );
}

export default App;