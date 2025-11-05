import { useAuthContext } from "@/processes/authProvider/authProvider";
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_publick")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isAuth, isLoading } = useAuthContext();

  // Пока проверяется аутентификация - показываем загрузку
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">
            Проверка аутентификации...
          </p>
        </div>
      </div>
    );
  }

  // Если уже авторизован - редирект на защищенные страницы (например, projects)
  if (isAuth) {
    return <Navigate to="/dashboard" />;
  }

  // Если не авторизован - показываем публичные страницы
  return <Outlet />;
}
