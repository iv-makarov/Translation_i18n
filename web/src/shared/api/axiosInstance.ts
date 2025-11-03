import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Создаем экземпляр axios с базовой конфигурацией
const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // 👈 КРИТИЧЕСКИ ВАЖНО для отправки cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Флаг для предотвращения бесконечного цикла refresh
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Функция для подписки на обновление токена
const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = () => {
  refreshSubscribers.forEach((cb) => cb("refreshed"));
  refreshSubscribers = [];
};

// Response Interceptor - автоматическое обновление токена
instance.interceptors.response.use(
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
        originalRequest.url?.includes("/auth/refresh") ||
        originalRequest.url?.includes("/auth/login")
      ) {
        return Promise.reject(error);
      }

      // Если уже идет процесс обновления токена
      if (isRefreshing) {
        // Подписываемся на обновление и ждем
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(instance.request(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Пытаемся обновить токен
        await instance.post("/auth/refresh");

        // Токен обновлен успешно
        isRefreshing = false;
        onTokenRefreshed();

        // Повторяем оригинальный запрос
        return instance.request(originalRequest);
      } catch (refreshError) {
        // Refresh не удался - пользователь не авторизован
        isRefreshing = false;
        refreshSubscribers = [];

        // Просто отклоняем ошибку - роутинг сам разберется через _protected/_publick
        // НЕ используем window.location.href - это вызывает перезагрузку и бесконечный цикл
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Функция-мутатор для orval
export const axiosInstance = async <T = unknown, D = unknown>(
  config: AxiosRequestConfig<D>
): Promise<AxiosResponse<T>> => {
  return instance.request<T, AxiosResponse<T>, D>(config);
};

// Тип для ошибок
export type ErrorType<Error> = AxiosError<Error>;
