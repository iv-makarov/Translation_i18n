import AuthWrapper from "@/widgets/wrappers/authWrapper";
import LoginForm from "@/features/login/loginForm";

export default function LoginPage() {
  return (
    <AuthWrapper>
      <LoginForm />
    </AuthWrapper>
  );
}
