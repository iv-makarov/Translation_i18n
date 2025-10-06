import { ThemeProvider } from "@/processes/themeProvider/themeProvider";
import { Outlet } from "@tanstack/react-router";

const App = () => {
  return (
    <ThemeProvider>
      <Outlet />
    </ThemeProvider>
  );
};

export default App;
