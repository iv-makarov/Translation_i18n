import { useAuthContext } from "@/processes/authProvider/authProvider";
import { useAuthControllerLogout } from "@/shared/api/endpoints/authentication/authentication";
import { useProfileControllerGetProfile } from "@/shared/api/endpoints/profile/profile";
import type { GetProfileResponseDto } from "@/shared/api/schemas/getProfileResponseDto";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import { useNavigate } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-react";
import { toast } from "sonner";

export default function NavigateProfile() {
  const { setAuth } = useAuthContext();
  const { mutateAsync: logout } = useAuthControllerLogout();
  const navigate = useNavigate();

  // Получаем данные профиля из запроса (данные уже предзагружены в loader)
  const { data: profileResponse } = useProfileControllerGetProfile();
  const profile = profileResponse?.data as GetProfileResponseDto | undefined;

  // Формируем инициалы пользователя
  const userInitials =
    profile?.firstName && profile?.lastName
      ? `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
      : "U";

  // Формируем имя пользователя
  const userName =
    profile?.firstName && profile?.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : "User";

  // Email не приходит в ответе, используем ID или placeholder
  const userEmail = profile?.email || "user@example.com";

  const handleLogout = async () => {
    await logout()
      .then(() => {
        setAuth(false);
        toast.success("Successfully logged out");
        navigate({ to: "/login" });
      })
      .catch((error: AxiosError) => {
        toast.error(error.message as string);
      });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userName}</span>
                <span className="truncate text-xs">{userEmail}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side="right"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userName}</span>
                  <span className="truncate text-xs">{userEmail}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate({ to: "/account" })}>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
