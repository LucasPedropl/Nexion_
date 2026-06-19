"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FileText, ListTodo, Users } from "lucide-react";
import { type Project } from "@nexion/database";
import { AppHeader } from "@/features/core/components/layout/app-header";
import { ProjectSubNav } from "@/features/core/components/layout/app-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/core/components/ui/card";
import { useProjects } from "@/features/projects/hooks/use-projects";

export default function ProjectOverviewPage() {
  const params = useParams<{ id: string }>();
  const { getProject, fetchProject } = useProjects();
  const [project, setProject] = useState<Project | null>(
    () => getProject(params.id) ?? null,
  );
  const [isLoading, setIsLoading] = useState(!project);

  useEffect(() => {
    let active = true;
    fetchProject(params.id).then((data) => {
      if (active) {
        setProject(data);
        setIsLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [params.id, fetchProject]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-center space-y-3">
          <p className="text-sm text-muted">Projeto não encontrado.</p>
          <Link href="/" className="text-sm text-brand hover:underline">
            Voltar aos projetos
          </Link>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Membros", value: project.memberCount, icon: Users },
    { label: "Tarefas", value: project.taskCount, icon: ListTodo },
    { label: "Documentos", value: project.documentCount, icon: FileText },
  ];

  return (
    <>
      <AppHeader title={project.name} description={project.description} />
      <ProjectSubNav projectId={project.id} />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map(({ label, value, icon: Icon }) => (
            <Card key={label}>
              <CardHeader className="flex-row items-center justify-between pb-2">
                <CardTitle>{label}</CardTitle>
                <Icon className="h-4 w-4 text-muted" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Próximos passos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted">
            <p>Kanban, documentos Markdown e assistente IA serão implementados nas próximas sprints.</p>
            <p>Dados sincronizados com Supabase.</p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
