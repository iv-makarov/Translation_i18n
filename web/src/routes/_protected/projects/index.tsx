import ProjectsPage from "@/page/projectsPage/projectsPage";
import {
  getProjectsControllerGetProjectsQueryKey,
  getProjectsControllerGetProjectsQueryOptions,
} from "@/shared/api/endpoints/projects/projects";
import type { GetProjectsResponseDto } from "@/shared/api/schemas/getProjectsResponseDto";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createFileRoute("/_protected/projects/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const queryOptions = getProjectsControllerGetProjectsQueryOptions({
      page: 1,
      isBlocked: false,
      isVerified: false,
    });
    await context.queryClient.ensureQueryData(queryOptions);
    return {};
  },
});

function RouteComponent() {
  const queryClient = useQueryClient();

  const projectsData = useMemo(() => {
    const queryKey = getProjectsControllerGetProjectsQueryKey();
    return queryClient.getQueryData<GetProjectsResponseDto>(queryKey);
  }, [queryClient]);

  return <ProjectsPage projects={projectsData ?? { projects: [] }} />;
}
