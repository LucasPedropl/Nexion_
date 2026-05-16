'use client'

import * as React from 'react'
import { Plus, Search, Filter, ClipboardList } from 'lucide-react'
import { Button } from '@/features/core/components/ui/button'
import { Dialog } from '@/features/core/components/ui/dialog'
import { CreateTaskForm } from './create-task-form'
import { createClient } from '@/features/core/lib/supabase/client'
import { cn } from '@/features/core/utils/cn'

interface ProjectTasksProps {
  project: any
}

export function ProjectTasks({ project }: ProjectTasksProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [tasks, setTasks] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const supabase = createClient()

  const fetchTasks = async () => {
    const { data } = await supabase
      .from('tasks')
      .select('*, assigned_profile:assigned_to(name, nickname)')
      .eq('project_id', project.id)
      .order('created_at', { ascending: false })
    if (data) setTasks(data)
    setIsLoading(false)
  }

  React.useEffect(() => {
    fetchTasks()

    // Realtime subscription
    const channel = supabase
      .channel(`project-tasks-${project.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks', filter: `project_id=eq.${project.id}` },
        () => fetchTasks()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [project.id])

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Backlog</h2>
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Nova Tarefa
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4 border-b border-border pb-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 text-muted-foreground mr-4">
          <Filter className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Filtros</span>
        </div>
        
        <select className="bg-muted/50 border border-border rounded-lg px-3 py-1.5 text-xs font-medium outline-none cursor-pointer hover:border-primary transition-all">
          <option>Todos os Tipos</option>
          <option>Tarefa</option>
          <option>Bug</option>
          <option>Melhoria</option>
        </select>

        <select className="bg-muted/50 border border-border rounded-lg px-3 py-1.5 text-xs font-medium outline-none cursor-pointer hover:border-primary transition-all">
          <option>Todos os Atores</option>
        </select>

        <button className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors ml-auto whitespace-nowrap">
          Ocultando Concluídas
        </button>
      </div>

      {/* Lista de Tarefas */}
      {tasks.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-3xl h-[400px] flex flex-col items-center justify-center text-center space-y-4">
          <div className="bg-muted p-4 rounded-full">
            <ClipboardList className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <p className="text-muted-foreground">Nenhuma tarefa encontrada com esses filtros.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className="bg-card border border-border p-4 rounded-xl flex items-center justify-between group hover:border-primary/50 transition-all shadow-sm"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  task.status === 'todo' ? "bg-muted" : task.status === 'in_progress' ? "bg-blue-500" : "bg-emerald-500"
                )} />
                <div className="min-w-0">
                  <h3 className="font-bold truncate">{task.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-bold text-primary uppercase bg-primary/5 px-2 py-0.5 rounded border border-primary/20">
                      {task.type}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {task.assigned_profile ? `@${task.assigned_profile.nickname}` : 'Não atribuído'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold uppercase text-muted-foreground">
                <span className={cn(
                  "px-3 py-1 rounded-full border",
                  task.status === 'todo' ? "border-border text-muted-foreground" : 
                  task.status === 'in_progress' ? "border-blue-500/30 text-blue-400" : 
                  "border-emerald-500/30 text-emerald-400"
                )}>
                  {task.status === 'todo' ? 'A Fazer' : task.status === 'in_progress' ? 'Em Progresso' : 'Concluído'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Nova Tarefa"
        description="Descreva o que precisa ser feito nesta etapa do projeto."
      >
        <CreateTaskForm 
          project={project}
          onSuccess={() => setIsModalOpen(false)} 
          onCancel={() => setIsModalOpen(false)}
        />
      </Dialog>
    </div>
  )
}
