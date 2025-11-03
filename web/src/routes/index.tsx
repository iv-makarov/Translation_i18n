import { useAuthContext } from "@/processes/authProvider/authProvider";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
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

  // Редирект в зависимости от статуса авторизации
  if (isAuthenticated) {
    // Если авторизован - редирект на главную защищенную страницу
    return <Navigate to="/dashboard" />;
  } else {
    // Если не авторизован - редирект на страницу логина
    return <Navigate to="/login" />;
  }
}
