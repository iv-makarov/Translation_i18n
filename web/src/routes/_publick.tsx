import { createFileRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_publick")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
