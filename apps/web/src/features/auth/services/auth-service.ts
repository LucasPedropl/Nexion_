import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database, Profile } from "@nexion/database";

type Client = SupabaseClient<Database>;

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  user_already_exists: "Este e-mail já está cadastrado. Faça login.",
  email_exists: "Este e-mail já está cadastrado. Faça login.",
  invalid_credentials: "E-mail ou senha incorretos.",
  email_not_confirmed: "Confirme seu e-mail antes de entrar.",
};

function mapAuthError(message: string): string {
  const normalized = message.toLowerCase();
  if (normalized.includes("already registered")) {
    return AUTH_ERROR_MESSAGES.user_already_exists;
  }
  for (const [key, value] of Object.entries(AUTH_ERROR_MESSAGES)) {
    if (normalized.includes(key.replace(/_/g, " ")) || normalized.includes(key)) {
      return value;
    }
  }
  return message;
}

export function mapProfile(
  row: Database["public"]["Tables"]["profiles"]["Row"],
): Profile {
  return {
    id: row.id,
    name: row.full_name,
    email: row.email,
    avatarUrl: row.avatar_url ?? undefined,
    theme: row.theme as Profile["theme"],
  };
}

export async function ensureProfile(
  supabase: Client,
  authUser: User,
): Promise<Profile> {
  const existing = await getProfile(supabase, authUser.id);
  if (existing) return existing;

  const fullName =
    (authUser.user_metadata?.full_name as string | undefined) ??
    authUser.email?.split("@")[0] ??
    "Usuário";

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: authUser.id,
      email: authUser.email ?? "",
      full_name: fullName,
    })
    .select("*")
    .single();

  if (error) {
    console.error("ensureProfile:", error.message);
    throw new Error("Não foi possível criar seu perfil. Tente novamente.");
  }

  return mapProfile(data);
}

export async function getProfile(
  supabase: Client,
  userId: string,
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("getProfile:", error.message);
    return null;
  }

  return data ? mapProfile(data) : null;
}

export async function updateProfileTheme(
  supabase: Client,
  userId: string,
  theme: NonNullable<Profile["theme"]>,
): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ theme })
    .eq("id", userId);

  if (error) {
    console.error("updateProfileTheme:", error.message);
    throw new Error(error.message);
  }
}

export async function signInWithEmail(
  supabase: Client,
  email: string,
  password: string,
): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(mapAuthError(error.message));
}

export async function signUpWithEmail(
  supabase: Client,
  name: string,
  email: string,
  password: string,
): Promise<{ needsEmailConfirmation: boolean }> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw new Error(mapAuthError(error.message));
  return { needsEmailConfirmation: Boolean(data.user && !data.session) };
}

export async function signOut(supabase: Client): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(mapAuthError(error.message));
}
