import LoginPage from "@/page/login/loginPage";
import PasswordRecoveryPage from "@/page/passwordRecovery/passwordRecoveryPage";
import RegisterPage from "@/page/register/registerPage";
import AuthorizedUsersWrapper from "@/widgets/wrappers/authorizedUsersWrapper";
import {ThemeProvider} from "@/processes/themeProvider/themeProvider";
import {BrowserRouter, Route, Routes} from "react-router";
import ProjectsPage from "@/page/projectsPage/ProjectsPage";

export const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/password-recovery" element={<PasswordRecoveryPage />} />
          <Route path="/" element={<AuthorizedUsersWrapper />}>
            <Route path="/" element={<div>Dashboard</div>} />
            <Route path="/projects" element={<ProjectsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};
