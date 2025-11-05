import { getUserControllerGetProfileQueryOptions } from "@/shared/api/endpoints/user/user";
import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface AuthContextType {
  isAuth: boolean;
  isLoading: boolean;
  checkAuth: () => boolean;
  setAuth: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Глобальная ссылка на функцию setAuth для использования в axios interceptor
let globalSetAuth: ((value: boolean) => void) | null = null;

// Экспортируем функцию для обновления состояния из interceptor
export const updateAuthState = (value: boolean) => {
  if (globalSetAuth) {
    globalSetAuth(value);
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const [isAuth, setIsAuth] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });
  const [isLoading, setIsLoading] = useState(true);
  const isInitialized = useRef(false);

  // Сохраняем ссылку на setAuth для глобального доступа
  useEffect(() => {
    globalSetAuth = (value: boolean) => {
      localStorage.setItem("isAuthenticated", value.toString());
      setIsAuth(value);
    };
    return () => {
      globalSetAuth = null;
    };
  }, []);

  // Проверяем реальное состояние аутентификации при загрузке приложения
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const checkAuthStatus = async () => {
      const localStorageAuth =
        localStorage.getItem("isAuthenticated") === "true";

      // Если в localStorage нет флага - сразу считаем неавторизованным
      if (!localStorageAuth) {
        setIsAuth(false);
        setIsLoading(false);
        return;
      }

      // Проверяем реальное состояние на бэкенде через React Query
      // Это позволяет использовать кэш и избежать дублирующих запросов
      try {
        const queryOptions = getUserControllerGetProfileQueryOptions();
        const queryKey = queryOptions.queryKey;

        // Проверяем, есть ли уже данные в кэше
        const cachedData = queryClient.getQueryData(queryKey);

        if (cachedData) {
          // Данные уже в кэше - используем их
          setIsAuth(true);
          setIsLoading(false);
        } else {
          // Данных нет в кэше - делаем запрос
          await queryClient.ensureQueryData(queryOptions);
          // Если запрос успешен - пользователь авторизован
          setIsAuth(true);
          setIsLoading(false);
        }
      } catch {
        // Если запрос не удался - пользователь не авторизован
        setIsAuth(false);
        localStorage.removeItem("isAuthenticated");
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [queryClient]);

  // Слушаем изменения localStorage от других вкладок
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "isAuthenticated") {
        setIsAuth(e.newValue === "true");
      }
    };

    // Слушаем кастомные события для обновления на той же вкладке
    const handleCustomStorageChange = () => {
      const value = localStorage.getItem("isAuthenticated") === "true";
      setIsAuth(value);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "auth-state-change",
      handleCustomStorageChange as EventListener
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "auth-state-change",
        handleCustomStorageChange as EventListener
      );
    };
  }, []);

  const checkAuth = useCallback(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  }, []);

  const setAuth = useCallback((value: boolean) => {
    localStorage.setItem("isAuthenticated", value.toString());
    setIsAuth(value);
    // Отправляем кастомное событие для обновления на той же вкладке
    window.dispatchEvent(
      new CustomEvent("auth-state-change", { detail: value.toString() })
    );
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, isLoading, checkAuth, setAuth }}>
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
