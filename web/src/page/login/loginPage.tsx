import LoginForm from "@/features/login/loginForm";
import { useAuthContext } from "@/processes/authProvider/authProvider";
import { useAuthControllerLogin } from "@/shared/api/endpoints/auth/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import AuthWrapper from "@/widgets/wrappers/authWrapper";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export default function LoginPage() {
  const { checkAuth } = useAuthContext();
  const { mutate: login } = useAuthControllerLogin();
  const navigate = useNavigate();

  return (
    <AuthWrapper>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Добро пожаловать</CardTitle>
            <CardDescription>Войдите в свой аккаунт</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm
              onSubmit={async (values) => {
                try {
                  await login({ data: values });
                  // После успешного логина проверяем авторизацию
                  await checkAuth();
                  // Редирект произойдет автоматически через _publick.tsx
                  toast.success("Вы успешно вошли в систему");
                  navigate({ to: "/projects" });
                } catch (error) {
                  console.error("Login error:", error);
                  toast.error("Ошибка входа. Проверьте email и пароль.");
                }
              }}
            />
          </CardContent>
        </Card>
      </div>
    </AuthWrapper>
  );
}
