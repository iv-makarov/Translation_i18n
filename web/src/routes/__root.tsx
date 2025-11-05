import App from "@/app/App";
import { queryClient } from "@/main";
import { createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: App,
  context: () => ({
    queryClient,
  }),
});
