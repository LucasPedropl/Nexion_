'use client'

import * as React from 'react'
import { createClient } from '@/features/core/lib/supabase/client'
import { cn } from '@/features/core/utils/cn'
import { MoreHorizontal, Plus } from 'lucide-react'

interface ProjectKanbanProps {
  project: any
}

const columns = [
  { id: 'todo', label: 'A Fazer', color: 'border-border' },
  { id: 'in_progress', label: 'Em Progresso', color: 'border-blue-500/50' },
  { id: 'done', label: 'Concluído', color: 'border-emerald-500/50' },
]

export function ProjectKanban({ project }: ProjectKanbanProps) {
  const [tasks, setTasks] = React.useState<any[]>([])
  const supabase = createClient()

  const fetchTasks = async () => {
    const { data } = await supabase
      .from('tasks')
      .select('*, assigned_profile:assigned_to(name, nickname)')
      .eq('project_id', project.id)
    if (data) setTasks(data)
  }

  React.useEffect(() => {
    fetchTasks()

    const channel = supabase
      .channel(`kanban-tasks-${project.id}`)
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

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId)
    
    if (error) alert('Erro ao atualizar status: ' + error.message)
  }

  return (
    <div className="p-8 h-full flex gap-6 overflow-x-auto no-scrollbar animate-in fade-in duration-500">
      {columns.map((column) => (
        <div 
          key={column.id} 
          className="flex-1 min-w-[350px] bg-sidebar/50 rounded-2xl border border-border flex flex-col overflow-hidden"
        >
          {/* Column Header */}
          <div className={cn("p-4 border-b flex items-center justify-between bg-card/50", column.color)}>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm uppercase tracking-widest">{column.label}</span>
              <span className="bg-muted px-2 py-0.5 rounded text-[10px] font-bold text-muted-foreground">
                {tasks.filter(t => t.status === column.id).length}
              </span>
            </div>
            <button className="text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Task List */}
          <div 
            className="flex-1 p-4 space-y-4 overflow-y-auto"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const taskId = e.dataTransfer.getData('taskId')
              updateTaskStatus(taskId, column.id)
            }}
          >
            {tasks
              .filter((t) => t.status === column.id)
              .map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
                  className="bg-card border border-border p-5 rounded-2xl shadow-sm hover:border-primary/50 transition-all cursor-grab active:cursor-grabbing group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold text-primary uppercase bg-primary/5 px-2 py-0.5 rounded border border-primary/20">
                      {task.type}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm mb-2">{task.title}</h4>
                  {task.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-purple-500 border-2 border-card flex items-center justify-center text-[10px] font-bold text-white">
                        {task.assigned_profile?.name?.[0].toUpperCase() || '?'}
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium italic">
                      {task.assigned_profile ? `@${task.assigned_profile.nickname}` : 'Sem dono'}
                    </span>
                  </div>
                </div>
              ))}
            
            {tasks.filter(t => t.status === column.id).length === 0 && (
              <div className="h-20 flex items-center justify-center text-muted-foreground/30 text-xs italic">
                Solte aqui para mover
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
