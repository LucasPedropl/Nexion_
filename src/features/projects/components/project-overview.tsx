'use client'

import * as React from 'react'
import { 
  Activity, 
  Plus, 
  CheckCircle2, 
  FileText, 
  Kanban, 
  Share2, 
  AlertCircle, 
  Clock 
} from 'lucide-react'
import { Button } from '@/features/core/components/ui/button'

interface ProjectOverviewProps {
  project: {
    id: string
    name: string
  }
}

export function ProjectOverview({ project }: ProjectOverviewProps) {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Section: Status & Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status Card */}
        <div className="lg:col-span-2 bg-card border border-border p-8 rounded-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold">Status do Projeto</h2>
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase">
              Saudável
            </span>
          </div>
          
          <p className="text-muted-foreground text-lg">
            Comece a organizar sua próxima grande ideia aqui.
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progresso Geral</span>
              <span className="font-bold">0% Concluído</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary w-0 transition-all duration-500" />
            </div>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> 0/0 tarefas
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> 0 documentos
              </span>
            </div>
          </div>
        </div>

        {/* Architecture & Actors */}
        <div className="space-y-6">
          <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Arquitetura
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Frontend', 'Backend', 'Mobile'].map(tag => (
                <span key={tag} className="px-3 py-1.5 rounded-lg bg-muted border border-border text-xs font-medium hover:border-primary transition-colors cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Atores
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Admin', 'User', 'Guest'].map(tag => (
                <span key={tag} className="px-3 py-1.5 rounded-lg bg-muted border border-border text-xs font-medium hover:border-primary transition-colors cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Attention, Activity, Docs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Atenção Necessária */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold">Atenção Necessária</span>
            </div>
            <span className="bg-muted px-2 py-0.5 rounded text-[10px] font-bold">0</span>
          </div>
          <div className="flex-1 p-12 flex flex-col items-center justify-center text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">Nenhuma tarefa crítica pendente.</p>
          </div>
        </div>

        {/* Atividade Recente */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold">Atividade Recente</span>
            </div>
          </div>
          <div className="flex-1 p-12 flex flex-col items-center justify-center text-center space-y-3">
            <Activity className="w-8 h-8 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">O projeto ainda não tem atividades.</p>
          </div>
        </div>

        {/* Docs Recentes */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold">Docs Recentes</span>
            </div>
          </div>
          <div className="flex-1 p-12 flex flex-col items-center justify-center text-center space-y-3">
            <p className="text-sm text-muted-foreground italic">Nenhum documento.</p>
          </div>
        </div>
      </div>

      {/* Bottom Section: Quick Actions */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Ações Rápidas</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Nova Tarefa', icon: Plus },
            { label: 'Novo Doc', icon: FileText },
            { label: 'Ver Quadro', icon: Kanban },
            { label: 'Diagramas', icon: Share2 },
          ].map((action) => (
            <button
              key={action.label}
              className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="bg-muted p-3 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <action.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
