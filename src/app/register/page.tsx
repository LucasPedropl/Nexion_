import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm flex flex-col items-center text-center space-y-8">
        <div className="bg-primary p-3 rounded-xl">
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 text-white fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Nexion</h1>
          <p className="text-muted-foreground">
            Crie sua conta para começar.
          </p>
        </div>

        <div className="w-full bg-[#232221] p-8 rounded-2xl border border-border shadow-xl">
          <h2 className="text-xl font-semibold mb-8">Criar nova conta</h2>
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
