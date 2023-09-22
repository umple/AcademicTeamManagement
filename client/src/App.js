import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import PrivateRoutes from "./Authentication/PrivateRoutes";
import RoleBasedRoutes from "./Authentication/RoleBasedRoutes";
import Groups from "./components/GroupView/GroupTable";
import ImportStudents from "./components/ImportStudentsView/ImportStudents";
import ProjectTable from "./components/ProjectTable/ProjectTable";
import ResponsiveAppBar from "./components/StaticComponents/NavBar/ResponsiveAppBar";
import PageNotFound from "./components/StaticComponents/PageNotFound/PageNotFound";
import StudentTable from "./components/StudentListingView/StudentTable";
import MyGroup from "./components/StudentView/MyGroup";
import StudentGroups from "./components/StudentView/StudentGroupTable";
import StudentProjects from "./components/StudentView/StudentProjects";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import StudentHomePage from "./pages/StudentHomePage";

const ROLES = {
  PROFESSOR: "professor",
  STUDENT: "student",
  NONE: ""
}

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
              <Route
                element={<RoleBasedRoutes allowedRole={ROLES.PROFESSOR} />}
              >
                <Route path="/ProfessorHome" element={<HomePage />}></Route>
                <Route path="/Students" element={<StudentTable />}></Route>
                <Route
                  exact
                  path="/Projects"
                  element={<ProjectTable />}
                ></Route>
                <Route
                  path="/ImportStudents"
                  element={<ImportStudents />}
                ></Route>
                <Route path="/GroupView" element={<Groups />}></Route>
              </Route>

              <Route element={<RoleBasedRoutes allowedRole={ROLES.STUDENT} />}>
                <Route
                  path="/StudentHome"
                  element={<StudentHomePage />}
                ></Route>
                <Route
                  path="/StudentProjects"
                  element={<StudentProjects />}
                ></Route>
                <Route
                  path="/StudentGroups"
                  element={<StudentGroups />}
                ></Route>
                <Route path="/MyGroup" element={<MyGroup />}></Route>
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
