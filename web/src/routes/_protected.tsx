import { useAuthContext } from "@/processes/authProvider/authProvider";
import AuthorizedUsersWrapper from "@/widgets/wrappers/authorizedUsersWrapper";
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected")({
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

  // Если не авторизован - редирект на страницу логина
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Если авторизован - показываем защищенный контент с layout
  return (
    <AuthorizedUsersWrapper>
      <Outlet />
    </AuthorizedUsersWrapper>
  );
}
