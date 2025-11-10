import UserCreate from "@/page/users/userCreate";
import UsersTable from "@/page/users/usersTable";
import type { GetUsersResponseDto } from "@/shared/api/schemas/getUsersResponseDto";

interface UsersPageProps {
  users: GetUsersResponseDto;
}

export default function UsersPage({ users }: UsersPageProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 border rounded-md flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Users</h3>
          <p className="text-muted-foreground">Users management</p>
        </div>
        <UserCreate />
      </div>
      <UsersTable users={users} />
    </div>
  );
}
