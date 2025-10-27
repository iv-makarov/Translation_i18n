import type { FilterProjectsDto } from "@/shared/api/$api";
import { projectsApi } from "@/shared/api/$api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Ключи для кэширования
export const projectsKeys = {
  all: ["projects"] as const,
  lists: () => [...projectsKeys.all, "list"] as const,
  list: (filters: FilterProjectsDto) =>
    [...projectsKeys.lists(), filters] as const,
  userProjects: (userId: string, filters: FilterProjectsDto) =>
    [...projectsKeys.all, "user", userId, filters] as const,
};

// Хук для получения всех проектов
export const useProjects = (filters?: FilterProjectsDto) => {
  return useQuery({
    queryKey: projectsKeys.list(filters || {}),
    queryFn: () => projectsApi.getProjects(filters),
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};

// Хук для получения проектов пользователя
export const useUserProjects = (
  userId: string,
  filters?: FilterProjectsDto
) => {
  return useQuery({
    queryKey: projectsKeys.userProjects(userId, filters || {}),
    queryFn: () => projectsApi.getProjectsByUser(userId, filters),
    enabled: !!userId, // Запрос выполняется только если userId существует
    staleTime: 5 * 60 * 1000,
  });
};

// Хук для создания проекта
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.createProject,
    onSuccess: () => {
      // Инвалидируем кэш проектов после создания
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });
    },
  });
};

// Хук для удаления проекта
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.deleteProject,
    onSuccess: () => {
      // Инвалидируем кэш проектов после удаления
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });
    },
  });
};
