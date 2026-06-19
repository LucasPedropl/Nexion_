import { AppHeader } from "@/features/core/components/layout/app-header";
import { DashboardContent } from "@/features/projects/components/dashboard-content";

export default function DashboardPage() {
  return (
    <>
      <AppHeader
        title="Projetos"
        description="Gerencie documentação e tarefas da sua equipe"
      />
      <main className="flex-1 overflow-y-auto p-6">
        <DashboardContent />
      </main>
    </>
  );
}
