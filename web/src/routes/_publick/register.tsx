import RegisterPage from "@/page/register/registerPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_publick/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return <RegisterPage />;
}
