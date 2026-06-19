import { AppHeader } from "@/features/core/components/layout/app-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/core/components/ui/card";

export default function NotificationsPage() {
  return (
    <>
      <AppHeader title="Notificações" description="Atualizações dos seus projetos" />
      <main className="flex-1 overflow-y-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Nenhuma notificação</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted">
              Convites, menções e atualizações aparecerão aqui.
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
