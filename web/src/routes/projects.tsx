import { createFileRoute } from "@tanstack/react-router";
import ProjectsPage from "@/page/projectsPage/projectsPage";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
});
