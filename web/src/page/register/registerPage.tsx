import RegisterForm from "@/features/register/registerForm";
import { api } from "@/processes/$api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import PublickWrapper from "@/widgets/wrappers/publicWrapper";
import { toast } from "sonner";

export default function RegisterPage() {
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
                const response = await api
                  .post("/auth/register", values)
                  .then((response) => {
                    toast.success(response.data.message);
                  })
                  .catch((error) => {
                    toast.error(error.response.data.message);
                  });
                return response;
              }}
            />
          </CardContent>
        </Card>
      </div>
    </PublickWrapper>
  );
}
