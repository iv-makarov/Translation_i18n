import { useAuthContext } from "@/processes/authProvider/authProvider";
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_publick")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isAuthenticated, isLoading } = useAuthContext();

  // Показываем загрузку пока проверяем авторизацию
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  // Если уже авторизован - редирект на защищенные страницы (например, projects)
  if (isAuthenticated) {
    return <Navigate to="/projects" />;
  }

  // Если не авторизован - показываем публичные страницы
  return <Outlet />;
}
