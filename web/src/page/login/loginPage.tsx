import LoginForm from "@/features/login/loginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import AuthWrapper from "@/widgets/wrappers/authWrapper";

export default function LoginPage() {
  return (
    <AuthWrapper>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>Login with your account</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm
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
