# Интеграция фронтенда с системой аутентификации

## 📋 Настройка Axios

Создайте файл с настроенным axios instance:

### `src/shared/api/$api.ts`

```typescript
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Создаем axios instance с базовыми настройками
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true, // 👈 КРИТИЧЕСКИ ВАЖНО для отправки cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Флаг для предотвращения бесконечного цикла refresh
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Функция для подписки на обновление токена
const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

// Функция для оповещения подписчиков
const onTokenRefreshed = () => {
  refreshSubscribers.forEach((cb) => cb('refreshed'));
  refreshSubscribers = [];
};

// Response Interceptor - автоматическое обновление токена
api.interceptors.response.use(
  // При успешном ответе просто возвращаем его
  (response) => response,

  // При ошибке проверяем, не истек ли токен
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Если ошибка 401 и это не повторный запрос
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Если это запрос на refresh или login - не пытаемся обновить токен
      if (
        originalRequest.url?.includes('/auth/refresh') ||
        originalRequest.url?.includes('/auth/login')
      ) {
        return Promise.reject(error);
      }

      // Если уже идет процесс обновления токена
      if (isRefreshing) {
        // Подписываемся на обновление и ждем
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Пытаемся обновить токен
        await api.post('/auth/refresh');

        // Токен обновлен успешно
        isRefreshing = false;
        onTokenRefreshed();

        // Повторяем оригинальный запрос
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh не удался - пользователь не авторизован
        isRefreshing = false;
        refreshSubscribers = [];

        // Редиректим на страницу логина
        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
```

## 🔐 API функции для аутентификации

### `src/shared/api/auth.ts`

```typescript
import { api } from './$api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Регистрация
export const register = async (data: RegisterData): Promise<User> => {
  const response = await api.post<{ user: User; message: string }>(
    '/auth/register',
    data,
  );
  return response.data.user;
};

// Вход
export const login = async (data: LoginData): Promise<User> => {
  const response = await api.post<{ user: User }>('/auth/login', data);
  return response.data.user;
};

// Выход
export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

// Обновление токена (обычно вызывается автоматически interceptor'ом)
export const refreshToken = async (): Promise<void> => {
  await api.post('/auth/refresh');
};

// Получение текущего пользователя (опционально)
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/user/me');
  return response.data;
};
```

## 🎯 React Context для аутентификации

### `src/contexts/AuthContext.tsx`

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../shared/api/auth';
import * as authApi from '../shared/api/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: authApi.RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Проверяем авторизацию при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Пытаемся получить данные текущего пользователя
        // Если токен валиден - получим данные
        // Если токен истек - interceptor автоматически обновит его
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        // Пользователь не авторизован
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const user = await authApi.login({ email, password });
    setUser(user);
  };

  const register = async (data: authApi.RegisterData) => {
    const user = await authApi.register(data);
    setUser(user);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

## 🛡️ Protected Route

### `src/components/ProtectedRoute.tsx`

```typescript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
```

## 📱 Пример использования в компонентах

### Login Form

```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

### Register Form

```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    organizationName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.firstName}
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        placeholder="First Name"
        required
      />
      <input
        type="text"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        placeholder="Last Name"
        required
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Password"
        required
      />
      <input
        type="text"
        value={formData.organizationName}
        onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
        placeholder="Organization Name"
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};
```

### Logout Button

```typescript
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LogoutButton: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return <button onClick={handleLogout}>Logout</button>;
};
```

## 🚀 Настройка приложения

### `src/main.tsx`

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

### `src/App.tsx`

```typescript
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <Routes>
      {/* Публичные роуты */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />

      {/* Защищенные роуты */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Редирект на dashboard по умолчанию */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
```

## ⚙️ Переменные окружения

### `.env.local`

```env
VITE_API_URL=http://localhost:3000
```

### `.env.production`

```env
VITE_API_URL=https://api.yourdomain.com
```

## 🧪 Тестирование

Вы можете проверить работу аутентификации:

1. **Регистрация**: Зарегистрируйте нового пользователя
2. **Логин**: Войдите с созданными credentials
3. **Защищенный запрос**: Попробуйте получить данные с защищенного эндпоинта
4. **Автообновление токена**: Подождите 15 минут (или измените время жизни токена) и сделайте запрос - токен должен обновиться автоматически
5. **Логаут**: Выйдите и проверьте, что доступ к защищенным роутам закрыт

## 🔍 Debugging

Для отладки можно добавить логирование в interceptor:

```typescript
// Request Interceptor
api.interceptors.request.use((config) => {
  console.log('Request:', config.method?.toUpperCase(), config.url);
  return config;
});

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.log('Error:', error.response?.status, error.config?.url);
    // ... остальной код
  },
);
```

## 📝 Важные замечания

1. **Не храните токены в localStorage/sessionStorage** - они автоматически в HttpOnly cookies
2. **Всегда используйте `withCredentials: true`** в axios
3. **CORS должен быть настроен с `credentials: true`** на бэкенде
4. **В production используйте HTTPS** для безопасности cookies
5. **Фронтенд и бэкенд должны быть на одном домене** или используйте правильные CORS настройки
