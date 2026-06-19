import { AuthLayout } from "@/features/core/components/layout/auth-layout";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Entrar na sua conta"
      description="Acesse seus projetos, tarefas e documentação."
    >
      <LoginForm />
    </AuthLayout>
  );
}
