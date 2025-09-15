import axios from "axios";

export const API_URL = "http://localhost:3000";

// Создаем экземпляр axios с базовой конфигурацией
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Интерцептор для добавления токена авторизации (временно отключен)
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("authToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Токен истек или недействителен
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Интерфейс для WhiteUrl
export interface WhiteUrl {
  id: string;
  url: string;
}

// Интерфейс для NameSpace
export interface NameSpace {
  id: string;
  name: string;
  project: string; // ID проекта
}

// Интерфейс для проекта
export interface Project {
  id: string;
  name: string;
  description: string;
  whiteUrls: WhiteUrl[];
  nameSpaces: NameSpace[];
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  isBlocked: boolean;
}

// Интерфейс для ответа API
export interface ProjectsResponse {
  data: Project[];
  total: number;
  page: number;
  limit: number;
}

// Интерфейс для фильтров
export interface FilterProjectsDto {
  page?: number;
  limit?: number;
  search?: string;
  isVerified?: boolean;
  isBlocked?: boolean;
}

// Функции для работы с API проектов
export const projectsApi = {
  // Получить все проекты
  getProjects: async (
    filters?: FilterProjectsDto
  ): Promise<ProjectsResponse> => {
    const response = await api.get("/projects", { params: filters });
    return response.data;
  },

  // Получить проекты пользователя
  getProjectsByUser: async (
    userId: string,
    filters?: FilterProjectsDto
  ): Promise<ProjectsResponse> => {
    const response = await api.get(`/projects/user/${userId}`, {
      params: filters,
    });
    return response.data;
  },

  // Создать проект
  createProject: async (data: {
    name: string;
    description: string;
    whiteUrls?: string[];
    nameSpaces?: string[];
  }): Promise<Project> => {
    const response = await api.post("/projects", data);
    return response.data;
  },

  // Удалить проект
  deleteProject: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};
