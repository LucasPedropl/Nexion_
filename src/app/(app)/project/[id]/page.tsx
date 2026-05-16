import { createClient } from "@/features/core/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { ProjectHeader } from "@/features/projects/components/project-header";
import { ProjectTabs } from "@/features/projects/components/project-tabs";
import { Suspense } from "react";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Buscar o projeto
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ProjectHeader project={project} />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center">Carregando...</div>}>
        <ProjectTabs project={project} />
      </Suspense>
    </div>
  );
}
