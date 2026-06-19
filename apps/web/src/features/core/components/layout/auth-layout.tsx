import Link from "next/link";
import { Hexagon } from "lucide-react";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AuthLayout({ title, description, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-1/2 flex-col justify-between border-r border-sidebar-border bg-sidebar p-10 lg:flex">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <Hexagon className="h-6 w-6 fill-brand text-brand" />
          <span className="text-lg font-semibold tracking-tight">Nexion</span>
        </Link>

        <div className="max-w-md space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Documentação e gestão em um só lugar
          </h1>
          <p className="text-muted leading-relaxed">
            Centralize tarefas, documentos e conhecimento técnico da sua equipe
            sem trocar de ferramenta a cada passo.
          </p>
        </div>

        <p className="text-xs text-muted">
          Protótipo acadêmico — UTFPR · TCC Nexion
        </p>
      </aside>

      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-2 lg:hidden"
            >
              <Hexagon className="h-5 w-5 fill-brand text-brand" />
              <span className="font-semibold">Nexion</span>
            </Link>
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
            <p className="text-sm text-muted">{description}</p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
