"use client";

import { Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Button } from "@/features/core/components/ui/button";
import { useAuth } from "@/features/auth/providers/auth-provider";

interface AppHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function AppHeader({ title, description, actions }: AppHeaderProps) {
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();
  const router = useRouter();

  function handleSignOut() {
    void signOut().then(() => router.push("/login"));
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-6">
      <div>
        <h1 className="text-sm font-medium text-foreground">{title}</h1>
        {description && (
          <p className="text-xs text-muted">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {actions}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Alternar tema"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sair">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
