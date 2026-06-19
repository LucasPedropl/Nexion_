import Link from "next/link";
import { ArrowRight, FileText, ListTodo, Users } from "lucide-react";
import type { Project } from "@nexion/database";
import { Badge } from "@/features/core/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/core/components/ui/card";

interface ProjectCardProps {
  project: Project;
}

const roleLabels = {
  owner: "Owner",
  admin: "Admin",
  member: "Membro",
} as const;

export function ProjectCard({ project }: ProjectCardProps) {
  const updated = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(project.updatedAt));

  return (
    <Link href={`/project/${project.id}`}>
      <Card className="group transition-colors hover:border-border-strong hover:bg-surface-elevated/50">
        <CardHeader className="flex-row items-start justify-between gap-3 pb-3">
          <div className="space-y-1">
            <CardTitle>{project.name}</CardTitle>
            {project.description && (
              <p className="text-sm text-muted line-clamp-2">{project.description}</p>
            )}
          </div>
          <Badge variant="secondary">{roleLabels[project.role]}</Badge>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="flex gap-4 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {project.memberCount}
            </span>
            <span className="flex items-center gap-1">
              <ListTodo className="h-3.5 w-3.5" />
              {project.taskCount}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              {project.documentCount}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Atualizado {updated}</span>
            <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
