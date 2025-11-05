import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";

interface AuthContextType {
  isAuth: boolean;
  checkAuth: () => boolean;
  setAuth: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const isAuth = useMemo(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  }, []);

  const checkAuth = useCallback(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  }, []);

  const setAuth = useCallback((value: boolean) => {
    localStorage.setItem("isAuthenticated", value.toString());
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuth, checkAuth, setAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
