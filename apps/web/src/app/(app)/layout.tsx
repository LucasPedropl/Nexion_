import { AuthGuard } from "@/features/auth/components/auth-guard";
import { AppSidebar } from "@/features/core/components/layout/app-sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">{children}</div>
      </div>
    </AuthGuard>
  );
}
