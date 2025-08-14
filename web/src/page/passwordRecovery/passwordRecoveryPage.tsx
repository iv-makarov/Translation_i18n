import PasswordRecoveryForm from "@/features/passwordRecovery/passwordRecoveryForm";
import AuthWrapper from "@/widgets/wrappers/authWrapper";

export default function PasswordRecoveryPage() {
  return (
    <AuthWrapper>
      <PasswordRecoveryForm />
    </AuthWrapper>
  );
}
