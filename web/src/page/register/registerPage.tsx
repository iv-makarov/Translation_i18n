import RegisterForm from "@/features/register/registerForm";
import AuthWrapper from "@/widgets/wrappers/authWrapper";

export default function RegisterPage() {
  return (
    <AuthWrapper>
      <RegisterForm />
    </AuthWrapper>
  );
}
