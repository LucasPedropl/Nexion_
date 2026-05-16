'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/features/core/utils/cn'
import { LayoutDashboard, Bell, Plus, Settings, LogOut } from 'lucide-react'
import { logout } from '@/features/auth/services/auth-service'
import { Dialog } from '@/features/core/components/ui/dialog'
import { CreateProjectForm } from '@/features/projects/components/create-project-form'
import { createClient } from '@/features/core/lib/supabase/client'

interface SidebarProps {
  user: {
    name: string
    nickname: string
    avatar_url?: string | null
  }
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [projects, setProjects] = React.useState<any[]>([])
  const supabase = createClient()

  React.useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) {
        console.error('Erro sidebar projects:', error)
        return
      }
      if (data) setProjects(data)
    }

    fetchProjects()

    // Realtime subscription para novos projetos
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        () => fetchProjects()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const menuItems = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Notificações', href: '/notifications', icon: Bell },
  ]

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <aside className="w-64 border-r border-border bg-sidebar flex flex-col shrink-0">
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-white fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
            </svg>
          </div>
          <span className="text-xl font-bold">Nexion</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium",
                pathname === item.href
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", pathname === item.href && "text-primary")} />
              {item.label}
            </Link>
          ))}

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Plus className="w-5 h-5" />
            Novo Projeto
          </button>

          <div className="pt-8 px-3">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
              Projetos
            </h3>
            <div className="space-y-1">
              {projects.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Nenhum projeto ainda.</p>
              ) : (
                projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/project/${project.id}`}
                    className="block px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground truncate transition-colors"
                  >
                    # {project.name}
                  </Link>
                ))
              )}
            </div>
          </div>
        </nav>

        {/* Footer / User */}
        <div className="p-4 border-t border-border space-y-4">
          <div className="flex items-center gap-3 px-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
              {getInitials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">@{user.nickname}</p>
            </div>
            <button 
              onClick={() => logout()}
              className="text-muted-foreground hover:text-red-500 transition-colors p-1"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Settings className="w-5 h-5" />
            Configurações
          </Link>
        </div>
      </aside>

      <Dialog 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Novo Projeto"
        description="Dê um nome para sua nova iniciativa. Você poderá mudar isso depois."
      >
        <CreateProjectForm 
          onSuccess={() => setIsModalOpen(false)} 
          onCancel={() => setIsModalOpen(false)}
        />
      </Dialog>
    </>
  )
}
