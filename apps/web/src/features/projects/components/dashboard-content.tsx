"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { projectSchema, type ProjectInput } from "@nexion/database";
import { Button } from "@/features/core/components/ui/button";
import { Input } from "@/features/core/components/ui/input";
import { FieldError, Label } from "@/features/core/components/ui/label";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { ProjectCard } from "@/features/projects/components/project-card";

export function DashboardContent() {
  const { projects, isLoading, createProject } = useProjects();
  const [isCreating, setIsCreating] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
  });

  async function onSubmit(data: ProjectInput) {
    await createProject(data);
    reset();
    setIsCreating(false);
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-lg border border-border bg-surface-elevated"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Seus projetos</h2>
          <p className="text-sm text-muted">
            {projects.length} projeto{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setIsCreating((v) => !v)}>
          <Plus className="h-4 w-4" />
          Novo projeto
        </Button>
      </div>

      {isCreating && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-lg border border-border bg-surface p-5 space-y-4 max-w-lg"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Nome do projeto</Label>
            <Input id="name" placeholder="Ex: Nexion Platform" {...register("name")} />
            <FieldError message={errors.name?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Input
              id="description"
              placeholder="Breve descrição do projeto"
              {...register("description")}
            />
            <FieldError message={errors.description?.message} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar projeto"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                reset();
                setIsCreating(false);
              }}
            >
              Cancelar
            </Button>
          </div>
        </form>
      )}

      {projects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-sm text-muted">
            Nenhum projeto ainda. Crie o primeiro para começar.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
