import UsersPage from "@/page/users/usersPage";
import {
  getUserControllerGetUsersQueryOptions,
  useUserControllerGetUsers,
} from "@/shared/api/endpoints/user/user";
import type { GetUsersResponseDto } from "@/shared/api/schemas/getUsersResponseDto";
import { createFileRoute } from "@tanstack/react-router";
import type { AxiosResponse } from "axios";

export const Route = createFileRoute("/_protected/users/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const queryOptions = getUserControllerGetUsersQueryOptions();
    await context.queryClient.ensureQueryData(queryOptions);
    return {};
  },
});

function RouteComponent() {
  const { data: users } =
    useUserControllerGetUsers<AxiosResponse<GetUsersResponseDto>>();
  console.log(users);
  return <UsersPage users={users?.data} />;
}
