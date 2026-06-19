"use client";

import { AppHeader } from "@/features/core/components/layout/app-header";
import { ThemeSelector } from "@/features/settings/components/theme-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/core/components/ui/card";
import { useAuth } from "@/features/auth/providers/auth-provider";

export function SettingsContent() {
  const { user } = useAuth();

  return (
    <>
      <AppHeader title="Configurações" description="Preferências da sua conta" />
      <main className="flex-1 overflow-y-auto p-6 space-y-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
          </CardHeader>
          <CardContent>
            <ThemeSelector />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>
              <span className="text-muted">Nome:</span> {user?.name ?? "—"}
            </p>
            <p>
              <span className="text-muted">E-mail:</span> {user?.email ?? "—"}
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
