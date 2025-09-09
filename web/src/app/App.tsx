import { ThemeProvider } from "@/processes/themeProvider/themeProvider";
import AuthorizedUsersWrapper from "@/widgets/wrappers/authorizedUsersWrapper";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { router } from "@/main";

const App = () => {
  return (
    <ThemeProvider>
      <AuthorizedUsersWrapper>
        <Outlet />
      </AuthorizedUsersWrapper>
      <TanStackRouterDevtools position="bottom-right" router={router} />
    </ThemeProvider>
  );
};

export default App;
