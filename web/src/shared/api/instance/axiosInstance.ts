import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { updateAuthState } from "@/processes/authProvider/authProvider";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Создаем экземпляр axios с базовой конфигурацией
const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // для отправки cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Флаг для предотвращения бесконечного цикла обновления токена
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Подписка на обновление токена
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
        originalRequest.url?.includes("/refresh") ||
        originalRequest.url?.includes("/login")
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
        await instance.post("/refresh");

        // Токен обновлен успешно
        isRefreshing = false;
        onTokenRefreshed();

        // Повторяем оригинальный запрос
        return instance.request(originalRequest);
      } catch (refreshError) {
        // Refresh не удался - пользователь не авторизован
        isRefreshing = false;
        refreshSubscribers = [];

        // Обновляем состояние аутентификации
        updateAuthState(false);

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Функция для orval
export const axiosInstance = async <T = unknown, D = unknown>(
  config: AxiosRequestConfig<D>
): Promise<AxiosResponse<T>> => {
  return instance.request<T, AxiosResponse<T>, D>(config);
};

export type ErrorType<Error> = AxiosError<Error>;
