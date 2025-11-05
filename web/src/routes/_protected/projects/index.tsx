import ProjectsPage from "@/page/projectsPage/projectsPage";
import {
  getProjectsControllerGetProjectsQueryKey,
  getProjectsControllerGetProjectsQueryOptions,
} from "@/shared/api/endpoints/projects/projects";
import type { ProjectsListResponseDto } from "@/shared/api/schemas/projectsListResponseDto";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createFileRoute("/_protected/projects/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const queryOptions = getProjectsControllerGetProjectsQueryOptions();
    await context.queryClient.ensureQueryData(queryOptions);
    return {};
  },
});

function RouteComponent() {
  const queryClient = useQueryClient();

  const projectsData = useMemo(() => {
    const queryKey = getProjectsControllerGetProjectsQueryKey();
    return queryClient.getQueryData<ProjectsListResponseDto>(queryKey);
  }, [queryClient]);

  return <ProjectsPage projects={projectsData?.data || []} />;
}
