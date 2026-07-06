import { AuthLayout } from "@/components/auth/AuthLayout";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Reset your password"
      description="We'll send a verification code to your email"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
