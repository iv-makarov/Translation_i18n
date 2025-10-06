import ProjectsPage from "@/page/projectsPage/projectsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/projects/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ProjectsPage />;
}
