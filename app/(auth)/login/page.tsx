import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

interface ILoginPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function LoginPage({ searchParams }: ILoginPageProps) {
  const { redirect } = await searchParams;

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to manage your subscriptions and billing"
    >
      <LoginForm redirectTo={redirect ?? "/dashboard"} />
    </AuthLayout>
  );
}
