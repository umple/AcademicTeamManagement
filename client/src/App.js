import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import PrivateRoutes from "./Authentication/PrivateRoutes";
import RoleBasedRoutes from "./Authentication/RoleBasedRoutes";
import ResponsiveAppBar from "./components/StaticComponents/NavBar/ResponsiveAppBar";
import PageNotFound from "./components/StaticComponents/PageNotFound/PageNotFound";
import { ROLES } from "./helpers/Roles";

// login page
import LoginPage from "./pages/LoginPage";

// Professor pages 
import HomePage from "./pages/professorPages/HomePage";
import ProfessorGroupPage from "./pages/professorPages/ProfessorGroupPage";
import ProfessorProjectPage from "./pages/professorPages/ProfessorProjectPage";
import ProfessorStudentPage from "./pages/professorPages/ProfessorStudentPage";

// Student pages 
import StudentGroupsPage from "./pages/studentPages/StudentGroupsPage";
import StudentHomePage from "./pages/studentPages/StudentHomePage";
import StudentMyGroupPage from "./pages/studentPages/StudentMyGroupPage";
import StudentProjectPage from "./pages/studentPages/StudentProjectPage";

const App = () => {
  return (
    <Router>
      <div>
        <div className="App">
          <div id="nav">
            <ResponsiveAppBar></ResponsiveAppBar>
          </div>
          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route element={<RoleBasedRoutes allowedRole={ROLES.PROFESSOR} />}>
                <Route path="/ProfessorHome" element={<HomePage />}></Route>
                <Route path="/Students" element={<ProfessorStudentPage />}></Route>
                <Route exact path="/Projects" element={<ProfessorProjectPage />}></Route>
                <Route path="/GroupView" element={<ProfessorGroupPage />}></Route>
              </Route>

              <Route element={<RoleBasedRoutes allowedRole={ROLES.STUDENT} />}>
                <Route path="/StudentHome" element={<StudentHomePage />}></Route>
                <Route path="/StudentProjects" element={<StudentProjectPage />}></Route>
                <Route path="/StudentGroups"  element={<StudentGroupsPage />}></Route>
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
  );
};

export default App;
