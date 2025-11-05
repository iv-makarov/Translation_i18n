import RegisterForm from "@/features/register/registerForm";
import { useAuthControllerRegister } from "@/shared/api/endpoints/auth/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import PublickWrapper from "@/widgets/wrappers/publicWrapper";
import { useNavigate } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export default function RegisterPage() {
  const { mutateAsync: register } = useAuthControllerRegister();
  const navigate = useNavigate();
  return (
    <PublickWrapper>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome</CardTitle>
            <CardDescription>Register with your account</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm
              onSubmit={async (values) => {
                await register({ data: values })
                  .then(() => {
                    toast.success("Successfully registered");
                    navigate({ to: "/login" });
                  })
                  .catch((error: AxiosError) => {
                    toast.error(error.message as string);
                  });
              }}
            />
          </CardContent>
        </Card>
      </div>
    </PublickWrapper>
  );
}
