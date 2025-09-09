import Header from "@/features/header/header";
import Navigate from "@/features/sidebarNavigate/navigate";
import {
  SidebarInset,
  SidebarProvider,
} from "@/shared/components/ui/sidebar";

interface AuthorizedUsersWrapperProps {
  children: React.ReactNode;
}

export default function AuthorizedUsersWrapper({ children }: AuthorizedUsersWrapperProps) {
  return (
    <SidebarProvider>
      <Navigate />
      <SidebarInset>
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
