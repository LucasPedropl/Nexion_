import { AuthLayout } from "@/features/core/components/layout/auth-layout";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Criar conta"
      description="Comece a centralizar documentação e tarefas da sua equipe."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
