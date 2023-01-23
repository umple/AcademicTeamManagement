import './App.css';
import ResponsiveAppBar from './Components/NavBar/ResponsiveAppBar';
import ProjectListAccordion from './Components/ProjectListAccordion/ProjectListAccordion';


function App() {
  return (
    <div>

      <div className="App">
        <div id="nav">
          <ResponsiveAppBar></ResponsiveAppBar>
        </div>
        <ProjectListAccordion></ProjectListAccordion>
      </div>
    </div>

  );
}

export default App;
