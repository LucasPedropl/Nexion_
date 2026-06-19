"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { type Project } from "@nexion/database";
import { AppHeader } from "@/features/core/components/layout/app-header";
import { ProjectSubNav } from "@/features/core/components/layout/app-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/core/components/ui/card";
import { useProjects } from "@/features/projects/hooks/use-projects";

function ProjectPlaceholder({ module: moduleName }: { module: string }) {
  const params = useParams<{ id: string }>();
  const { getProject, fetchProject } = useProjects();
  const [project, setProject] = useState<Project | null>(
    () => getProject(params.id) ?? null,
  );

  useEffect(() => {
    fetchProject(params.id).then(setProject);
  }, [params.id, fetchProject]);

  if (!project) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <Link href="/" className="text-sm text-brand hover:underline">
          Voltar aos projetos
        </Link>
      </div>
    );
  }

  return (
    <>
      <AppHeader title={project.name} description={moduleName} />
      <ProjectSubNav projectId={project.id} />
      <main className="flex-1 overflow-y-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>{moduleName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted">Módulo em desenvolvimento.</p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

export default function ProjectTasksPage() {
  return <ProjectPlaceholder module="Tarefas — Kanban" />;
}
