"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/features/core/utils/cn";
import { useAuth } from "@/features/auth/providers/auth-provider";

const options = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Escuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Monitor },
] as const;

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const { user, updateTheme } = useAuth();

  useEffect(() => {
    if (user?.theme && user.theme !== theme) {
      setTheme(user.theme);
    }
  }, [user?.theme, theme, setTheme]);

  async function handleChange(value: "light" | "dark" | "system") {
    setTheme(value);
    try {
      await updateTheme(value);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => handleChange(value)}
          className={cn(
            "flex flex-col items-center gap-2 rounded-md border p-4 text-sm transition-colors",
            theme === value
              ? "border-brand bg-brand-muted text-foreground"
              : "border-border text-muted hover:bg-surface-elevated hover:text-foreground",
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
