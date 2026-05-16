import { createClient } from "@/features/core/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { ProjectSettingsHeader } from "@/features/projects/components/settings/project-settings-header";
import { ProjectSettingsTabs } from "@/features/projects/components/settings/project-settings-tabs";

interface ProjectSettingsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectSettingsPage({ params }: ProjectSettingsPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !project) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ProjectSettingsHeader project={project} />
      <ProjectSettingsTabs project={project} />
    </div>
  );
}
