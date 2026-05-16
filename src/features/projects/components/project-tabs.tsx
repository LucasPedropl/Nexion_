'use client'

import * as React from 'react'
import { cn } from '@/features/core/utils/cn'
import { 
  LayoutDashboard, 
  CheckSquare, 
  Kanban, 
  FileEdit, 
  FileText, 
  Share2 
} from 'lucide-react'
import { ProjectOverview } from './project-overview'
import { ProjectTasks } from './tasks/project-tasks'
import { ProjectKanban } from './tasks/project-kanban'

interface ProjectTabsProps {
  project: {
    id: string
    name: string
  }
}

const tabs = [
  { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tarefas', icon: CheckSquare },
  { id: 'kanban', label: 'Quadro', icon: Kanban },
  { id: 'notes', label: 'Anotações (IA)', icon: FileEdit },
  { id: 'docs', label: 'Documentação', icon: FileText },
  { id: 'diagrams', label: 'Diagramas', icon: Share2 },
]

export function ProjectTabs({ project }: ProjectTabsProps) {
  const [activeTab, setActiveTab] = React.useState('overview')

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b border-border bg-background px-6 shrink-0">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-all relative top-[1px]",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#1A1918]/50">
        {activeTab === 'overview' && <ProjectOverview project={project} />}
        {activeTab === 'tasks' && <ProjectTasks project={project} />}
        {activeTab === 'kanban' && <ProjectKanban project={project} />}
        {!['overview', 'tasks', 'kanban'].includes(activeTab) && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Funcionalidade de {tabs.find(t => t.id === activeTab)?.label} em desenvolvimento...
          </div>
        )}
      </div>
    </div>
  )
}
