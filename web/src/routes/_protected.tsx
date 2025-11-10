import { useAuthContext } from "@/processes/authProvider/authProvider";
import { getProfileControllerGetProfileQueryOptions } from "@/shared/api/endpoints/profile/profile";
import ProtectedWrapper from "@/widgets/wrappers/protectedWrapper";
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const queryOptions = getProfileControllerGetProfileQueryOptions();
    await context.queryClient.ensureQueryData(queryOptions);
    return {};
  },
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

  // Если не авторизован - редирект на страницу логина
  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  // Если авторизован - показываем защищенный контент с layout
  return (
    <ProtectedWrapper>
      <Outlet />
    </ProtectedWrapper>
  );
}
