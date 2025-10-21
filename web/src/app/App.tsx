import { AuthProvider } from "@/processes/authProvider/authProvider";
import { ThemeProvider } from "@/processes/themeProvider/themeProvider";
import { Toaster } from "@/shared/components/ui/sonner";
import { Outlet } from "@tanstack/react-router";

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Outlet />
        <Toaster position="bottom-right" richColors />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
