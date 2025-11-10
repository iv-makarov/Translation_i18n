import { useAuthContext } from "@/processes/authProvider/authProvider";
import { Spinner } from "@/shared/components/ui/spinner";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isAuth, isLoading } = useAuthContext();

  // Показываем загрузку пока проверяем авторизацию
  if (isLoading) {
    return (
      <Spinner className="size-10 mx-auto" />
    );
  }

  // Редирект в зависимости от статуса авторизации
  if (isAuth) {
    // Если авторизован - редирект на главную защищенную страницу
    return <Navigate to="/dashboard" />;
  } else {
    // Если не авторизован - редирект на страницу логина
    return <Navigate to="/login" />;
  }
}
