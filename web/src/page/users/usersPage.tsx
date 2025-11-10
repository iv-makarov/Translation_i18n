import UsersTable from "@/page/users/usersTable";
import type { GetUsersResponseDto } from "@/shared/api/schemas/getUsersResponseDto";

interface UsersPageProps {
  users: GetUsersResponseDto;
}

export default function UsersPage({ users }: UsersPageProps) {
  return <UsersTable users={users} />;
}
