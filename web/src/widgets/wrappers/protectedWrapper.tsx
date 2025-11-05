import Header from "@/features/header/header";
import Navigate from "@/features/sidebarNavigate/navigate";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";

interface ProtectedWrapperProps {
  children: React.ReactNode;
}

export default function ProtectedWrapper({
  children,
}: ProtectedWrapperProps) {
  return (
    <SidebarProvider>
      <Navigate />
      <SidebarInset>
        <Header />
        <div className="p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
