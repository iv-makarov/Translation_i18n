import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import { useNavigate } from "@tanstack/react-router";
import { FileText, Home } from "lucide-react";

export default function NavigateMain() {
  const navigate = useNavigate();
  const items = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/",
    },
    {
      title: "Projects",
      icon: FileText,
      path: "/projects",
    },
  ];
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={item.title}
              onClick={() => navigate({ to: item.path })}
            >
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
