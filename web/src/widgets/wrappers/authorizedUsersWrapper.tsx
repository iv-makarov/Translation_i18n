import Header from "@/features/header/header";
import Navigate from "@/features/sidebarNavigate/navigate";
import {
  SidebarInset,
  SidebarProvider,
} from "@/shared/components/ui/sidebar";
import { Outlet } from "react-router";



export default function AuthorizedUsersWrapper() {
  return (
    <SidebarProvider>
      <Navigate />
      <SidebarInset>
        <Header />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
