"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { type Project } from "@nexion/database";
import { AppHeader } from "@/features/core/components/layout/app-header";
import { ProjectSubNav } from "@/features/core/components/layout/app-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/core/components/ui/card";
import { useProjects } from "@/features/projects/hooks/use-projects";

export default function ProjectSettingsPage() {
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
      <AppHeader title={project.name} description="Configurações do projeto" />
      <ProjectSubNav projectId={project.id} />
      <main className="flex-1 overflow-y-auto p-6 space-y-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Equipe</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted">
              Convites e gestão de membros serão implementados em breve.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Geral</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>
              <span className="text-muted">Slug:</span> {project.slug}
            </p>
            <p>
              <span className="text-muted">Seu papel:</span> {project.role}
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
