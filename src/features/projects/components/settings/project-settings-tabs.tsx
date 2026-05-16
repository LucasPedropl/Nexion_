'use client'

import * as React from 'react'
import { cn } from '@/features/core/utils/cn'
import { 
  Settings, 
  Layers, 
  Users, 
  Zap, 
  ShieldAlert 
} from 'lucide-react'

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

import { TeamSettings } from './team-settings'
import { ArchitectureSettings } from './architecture-settings'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

interface ProjectSettingsTabsProps {
  project: any
}

const tabs = [
  { id: 'general', label: 'Geral', icon: Settings },
  { id: 'architecture', label: 'Arquitetura', icon: Layers },
  { id: 'team', label: 'Equipe', icon: Users },
  { id: 'repos', label: 'Repositórios', icon: GithubIcon },
  { id: 'integrations', label: 'Integrações', icon: Zap },
  { id: 'advanced', label: 'Avançado', icon: ShieldAlert },
]

export function ProjectSettingsTabs({ project }: ProjectSettingsTabsProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') || 'architecture'

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b border-border bg-background px-6 shrink-0">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={`${pathname}?tab=${tab.id}`}
              scroll={false}
              className={cn(
                "flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-all relative top-[1px]",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#1A1918]/50 p-10">
        {activeTab === 'team' && <TeamSettings project={project} />}
        {activeTab === 'architecture' && <ArchitectureSettings project={project} />}
        {!['team', 'architecture'].includes(activeTab) && (
          <div className="flex items-center justify-center h-full text-muted-foreground italic">
            Configurações de {tabs.find(t => t.id === activeTab)?.label} em desenvolvimento...
          </div>
        )}
      </div>
    </div>
  )
}
