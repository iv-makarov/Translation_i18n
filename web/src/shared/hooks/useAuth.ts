import { api } from "@/shared/api/$api";
import { useEffect, useRef, useState } from "react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Флаг для предотвращения повторных проверок
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    // Проверяем только один раз при монтировании
    if (!hasCheckedRef.current) {
      hasCheckedRef.current = true;
      checkAuth();
    }
  }, []);

  const checkAuth = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Пытаемся получить данные профиля
      // Если токены валидны, получим данные
      // Если нет - перехватчик в $api.ts автоматически попытается обновить токен
      const response = await api.get<User>("/profile/profile");

      setAuthState({
        user: response.data,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (error) {
      // Если не удалось получить профиль даже после попытки refresh
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: error as Error,
      });
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
      // Сбрасываем флаг проверки, чтобы после повторного входа проверка произошла
      hasCheckedRef.current = false;
    } catch (error) {
      console.error("Logout error:", error);
      // Даже если запрос не удался, очищаем состояние
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
      hasCheckedRef.current = false;
    }
  };

  return {
    ...authState,
    checkAuth,
    logout,
  };
}
