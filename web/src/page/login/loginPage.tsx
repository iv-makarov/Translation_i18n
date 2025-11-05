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
import type { AxiosError } from "axios";
import { toast } from "sonner";

export default function LoginPage() {
  const { mutateAsync: login } = useAuthControllerLogin();
  const navigate = useNavigate();
  const { setAuth } = useAuthContext();

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
                await login({ data: values })
                  .then(() => {
                    toast.success("Successfully logged in");
                    setAuth(true);
                    navigate({ to: "/dashboard" });
                  })
                  .catch((error: AxiosError) => {
                    toast.error(error.message as string);
                  });
              }}
            />
          </CardContent>
        </Card>
      </div>
    </AuthWrapper>
  );
}
