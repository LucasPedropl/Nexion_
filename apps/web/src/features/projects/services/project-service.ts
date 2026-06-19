import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Project, ProjectInput } from "@nexion/database";
import { ensureProfile } from "@/features/auth/services/auth-service";

type Client = SupabaseClient<Database>;

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface ProjectMembershipRow {
  role: Database["public"]["Enums"]["project_role"];
  projects: {
    id: string;
    name: string;
    description: string | null;
    slug: string;
    updated_at: string;
    project_members: [{ count: number }] | null;
    tasks: [{ count: number }] | null;
    documents: [{ count: number }] | null;
  } | null;
}

function mapProject(row: ProjectMembershipRow): Project | null {
  if (!row.projects) return null;
  const p = row.projects;
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? undefined,
    slug: p.slug,
    role: row.role,
    memberCount: p.project_members?.[0]?.count ?? 0,
    taskCount: p.tasks?.[0]?.count ?? 0,
    documentCount: p.documents?.[0]?.count ?? 0,
    updatedAt: p.updated_at,
  };
}

export async function listProjects(supabase: Client): Promise<Project[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("project_members")
    .select(
      `role,
      projects (
        id, name, description, slug, updated_at,
        project_members (count),
        tasks (count),
        documents (count)
      )`,
    )
    .eq("user_id", user.id)
    .order("joined_at", { ascending: false });

  if (error) {
    console.error("listProjects:", error.message);
    throw new Error(error.message);
  }

  return (data as ProjectMembershipRow[])
    .map(mapProject)
    .filter((p): p is Project => p !== null);
}

export async function createProject(
  supabase: Client,
  input: ProjectInput,
): Promise<Project> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado");

  await ensureProfile(supabase, user);

  const slug = slugify(input.name);
  const { data, error } = await supabase
    .from("projects")
    .insert({
      name: input.name,
      description: input.description ?? null,
      slug,
      owner_id: user.id,
    })
    .select("id, name, description, slug, updated_at")
    .single();

  if (error) {
    console.error("createProject:", error.message);
    throw new Error("Não foi possível criar o projeto. Tente novamente.");
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description ?? undefined,
    slug: data.slug,
    role: "owner",
    memberCount: 1,
    taskCount: 0,
    documentCount: 0,
    updatedAt: data.updated_at,
  };
}

export async function getProjectById(
  supabase: Client,
  projectId: string,
): Promise<Project | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("project_members")
    .select(
      `role,
      projects (
        id, name, description, slug, updated_at,
        project_members (count),
        tasks (count),
        documents (count)
      )`,
    )
    .eq("user_id", user.id)
    .eq("project_id", projectId)
    .maybeSingle();

  if (error) {
    console.error("getProjectById:", error.message);
    return null;
  }

  return data ? mapProject(data as ProjectMembershipRow) : null;
}
