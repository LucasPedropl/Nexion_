"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BookOpen,
  FolderKanban,
  Hexagon,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { cn } from "@/features/core/utils/cn";
import { Avatar } from "@/features/core/components/ui/avatar";
import { useAuth } from "@/features/auth/providers/auth-provider";

const mainNav = [
  { href: "/", label: "Projetos", icon: LayoutDashboard },
  { href: "/notifications", label: "Notificações", icon: Bell },
  { href: "/settings", label: "Configurações", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <Hexagon className="h-5 w-5 fill-brand text-brand" />
        <span className="font-semibold tracking-tight">Nexion</span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {mainNav.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/" || pathname.startsWith("/project")
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-surface-elevated text-foreground"
                  : "text-muted hover:bg-surface-elevated hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
          <Avatar name={user?.name ?? "Usuário"} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.name}</p>
            <p className="truncate text-xs text-muted">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function ProjectSubNav({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const base = `/project/${projectId}`;

  const items = [
    { href: base, label: "Visão geral", icon: LayoutDashboard, exact: true },
    { href: `${base}/tasks`, label: "Tarefas", icon: FolderKanban },
    { href: `${base}/docs`, label: "Documentos", icon: BookOpen },
    { href: `${base}/settings`, label: "Configurações", icon: Settings },
  ];

  return (
    <div className="flex gap-1 border-b border-border px-6">
      {items.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 border-b-2 px-3 py-3 text-sm transition-colors -mb-px",
              active
                ? "border-brand text-foreground"
                : "border-transparent text-muted hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </div>
  );
}
