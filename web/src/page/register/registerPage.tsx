import RegisterForm from "@/features/register/registerForm";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/shared/components/ui/card";
import AuthWrapper from "@/widgets/wrappers/authWrapper";

export default function RegisterPage() {
  return (
    <AuthWrapper>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome</CardTitle>
            <CardDescription>Register with your account</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm
              onSubmit={async (values) => {
                await console.log(values);
              }}
            />
          </CardContent>
        </Card>
      </div>
    </AuthWrapper>
  );
}
