import { createClient } from "@/features/core/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/features/core/components/ui/button";
import { Rocket, ShieldCheck, Clock } from "lucide-react";
import Link from "next/link";
import { PendingRequest } from "@/features/projects/components/pending-request";

interface JoinProjectPageProps {
  params: Promise<{ code: string }>;
}

export default async function JoinProjectPage({ params }: JoinProjectPageProps) {
  const { code } = await params;
  const supabase = await createClient();

  // 1. Buscar o projeto pelo código de convite via RPC (ignora RLS)
  const { data: projectData } = await supabase
    .rpc("get_project_by_invite_code", { p_code: code })
    .single();

  const project = projectData as any;

  if (!project) notFound();

  // 2. Verificar se o usuário está logado via sessão ativa (mais rápido que getUser no Server)
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    // Se não logado, redireciona para login com o retorno salvo
    redirect(`/login?next=/join/${code}`);
  }

  const user = session.user;

  // 3. Verificar se já é membro ou já tem solicitação
  const { data: existingMember } = await supabase
    .from("project_members")
    .select("id")
    .eq("project_id", project.id)
    .eq("user_id", user.id)
    .single();

  if (existingMember) {
    redirect(`/project/${project.id}`);
  }

  const { data: existingRequest } = await supabase
    .from("project_join_requests")
    .select("status")
    .eq("project_id", project.id)
    .eq("user_id", user.id)
    .single();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-lg flex flex-col items-center text-center space-y-8">
        <div className="bg-primary/10 p-4 rounded-2xl border border-primary/20">
          <Rocket className="w-12 h-12 text-primary" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Convite de Equipe</h1>
          <p className="text-muted-foreground text-lg">
            Você foi convidado para participar do projeto <span className="text-foreground font-bold">{project.name}</span>.
          </p>
          <p className="text-sm text-muted-foreground">
            Criado por <span className="font-medium text-primary">@{project.profiles.nickname}</span>
          </p>
        </div>

        <div className="w-full bg-[#232221] p-10 rounded-3xl border border-border shadow-2xl space-y-8">
          {existingRequest?.status === 'pending' ? (
            <PendingRequest />
          ) : (
            <div className="space-y-6">
              <div className="space-y-2 text-left bg-muted/30 p-6 rounded-2xl border border-border/50">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Termos de Acesso
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2 mt-4">
                  <li>• Você entrará inicialmente como <span className="text-primary font-bold">Colaborador</span>.</li>
                  <li>• Terá acesso às tarefas, quadro e documentação.</li>
                  <li>• Suas atividades serão visíveis para os outros membros.</li>
                </ul>
              </div>

              <form action={async () => {
                'use server'
                const supabase = await createClient();
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                  const { error } = await supabase.from('project_join_requests').insert({
                    project_id: project.id,
                    user_id: user.id
                  });
                  if (!error) {
                    const { revalidatePath } = await import('next/cache');
                    revalidatePath(`/join/${code}`);
                  }
                }
              }}>
                <Button type="submit" fullWidth size="lg" className="h-14 text-lg font-bold shadow-orange-500/20 shadow-xl">
                  Solicitar Entrada →
                </Button>
              </form>
              
              <p className="text-[10px] text-muted-foreground uppercase font-bold">
                Ao clicar, o dono do projeto receberá seu pedido.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
