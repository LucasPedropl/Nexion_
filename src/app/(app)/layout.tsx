import { createClient } from "@/features/core/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/features/core/components/layout/sidebar";
import { ThemeProvider } from "@/features/core/providers/theme-provider";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Buscar perfil do usuário
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/login");
  }

  return (
    <ThemeProvider initialTheme={profile.theme || 'sunset'}>
      <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
        <Sidebar user={profile} />
        <main className="flex-1 flex flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
