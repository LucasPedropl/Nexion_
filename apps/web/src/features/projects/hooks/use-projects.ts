"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Project, ProjectInput } from "@nexion/database";
import { createClient } from "@/features/core/lib/supabase/client";
import {
  createProject as createProjectService,
  getProjectById,
  listProjects,
} from "@/features/projects/services/project-service";

export function useProjects() {
  const supabase = useMemo(() => createClient(), []);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const data = await listProjects(supabase);
      setProjects(data);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar os projetos.");
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createProject = useCallback(
    async (input: ProjectInput) => {
      setError(null);
      try {
        const project = await createProjectService(supabase, input);
        setProjects((prev) => [project, ...prev]);
        return project;
      } catch (err) {
        console.error(err);
        setError("Não foi possível criar o projeto.");
        throw err;
      }
    },
    [supabase],
  );

  const getProject = useCallback(
    (id: string) => projects.find((p) => p.id === id) ?? null,
    [projects],
  );

  const fetchProject = useCallback(
    async (id: string) => {
      const cached = projects.find((p) => p.id === id);
      if (cached) return cached;
      return getProjectById(supabase, id);
    },
    [supabase, projects],
  );

  return { projects, isLoading, error, createProject, getProject, fetchProject, refresh };
}
