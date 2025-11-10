import type { GetUsersResponseDto } from "@/shared/api/schemas/getUsersResponseDto";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Check, Edit, MoreHorizontal, Trash2 } from "lucide-react";

interface UsersTableProps {
  users: GetUsersResponseDto;
}

export default function UsersTable({ users }: UsersTableProps) {
  return (
    <div>
      {/* Информация о количестве проектов */}
      {users.users.length > 0 && (
        <div className="mb-4 text-sm text-muted-foreground">
          Всего проектов: {users.users.length}
        </div>
      )}

      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 whitespace-nowrap">
              <TableHead className="h-9 py-2">Last Name</TableHead>
              <TableHead className="h-9 py-2">First Name</TableHead>
              <TableHead className="h-9 py-2">Email</TableHead>
              <TableHead className="h-9 py-2">Role</TableHead>
              <TableHead className="h-9 py-2">Status</TableHead>
              <TableHead className="h-9 py-2">Created At</TableHead>
              <TableHead className="h-9 py-2 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-x-auto">
            {users.users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  Users not found
                </TableCell>
              </TableRow>
            ) : (
              users.users.map((user) => (
                <TableRow
                  className="cursor-pointer"
                  key={user.id}
                  onClick={() => {
                    console.log("User", user.id);
                  }}
                >
                  <TableCell className="py-2 whitespace-nowrap">
                    <div>
                      <div className="font-medium">{user.lastName}</div>
                    </div>
                  </TableCell>
                  <TableCell className="py-2 whitespace-nowrap">
                    <div className="font-medium">{user.firstName}</div>
                  </TableCell>
                  <TableCell className="py-2 whitespace-nowrap">
                    {user.email}
                  </TableCell>
                  <TableCell className="py-2 whitespace-nowrap">
                    {user.role}
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex flex-col gap-2">
                      <Badge
                        variant={user.isActive ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {user.isActive ? "Активен" : "Не активен"}
                      </Badge>
                      <Badge
                        variant={user.isEmailVerified ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {user.isEmailVerified
                          ? "Email проверен"
                          : "Email не проверен"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="py-2 whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                  </TableCell>
                  <TableCell className="py-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="flex justify-end items-center">
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Edit", user.id);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Verify", user.id);
                          }}
                        >
                          <Check className="mr-2 h-4 w-4" /> Verify
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Пагинация */}
      {/* {projects.total > filters.limit && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="text-sm text-muted-foreground">
            Показано {(filters.page - 1) * filters.limit + 1} -{" "}
            {Math.min(filters.page * filters.limit, projects.total)} из{" "}
            {projects.total} проектов
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              disabled={filters.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Предыдущая
            </Button>
            <div className="flex items-center space-x-1">
              <span className="text-sm">
                Страница {filters.page} из{" "}
                {Math.ceil(projects.total / filters.limit)}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              disabled={
                filters.page >= Math.ceil(projects.total / filters.limit)
              }
            >
              Следующая
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )} */}
    </div>
  );
}
