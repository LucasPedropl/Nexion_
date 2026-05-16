'use client'

import * as React from 'react'
import { createClient } from '@/features/core/lib/supabase/client'
import { cn } from '@/features/core/utils/cn'
import { MoreHorizontal, Plus, Edit2, Trash2 } from 'lucide-react'
import { Dialog } from '@/features/core/components/ui/dialog'
import { Button } from '@/features/core/components/ui/button'
import { Input } from '@/features/core/components/ui/input'

interface ProjectKanbanProps {
  project: any
}

export function ProjectKanban({ project }: ProjectKanbanProps) {
  const [tasks, setTasks] = React.useState<any[]>([])
  const [columns, setColumns] = React.useState<any[]>([])
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null)
  
  // Modals state
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [isRenameOpen, setIsRenameOpen] = React.useState(false)
  const [newColumnName, setNewColumnName] = React.useState('')
  const [targetIndex, setTargetIndex] = React.useState<number | null>(null)
  const [targetColumn, setTargetColumn] = React.useState<any>(null)
  
  // Drag and Drop state
  const [draggedTaskId, setDraggedTaskId] = React.useState<string | null>(null)
  const [dragOverColId, setDragOverColId] = React.useState<string | null>(null)

  const supabase = createClient()

  const fetchData = async () => {
    // Buscar tarefas
    const { data: tasksData } = await supabase
      .from('tasks')
      .select('*, assigned_profile:assigned_to(name, nickname)')
      .eq('project_id', project.id)
    if (tasksData) setTasks(tasksData)

    // Buscar colunas do projeto atualizadas
    const { data: projData } = await supabase
      .from('projects')
      .select('kanban_columns')
      .eq('id', project.id)
      .single()
    
    if (projData?.kanban_columns) {
      setColumns(projData.kanban_columns)
    } else if (project.kanban_columns) {
      setColumns(project.kanban_columns)
    }
  }

  React.useEffect(() => {
    fetchData()

    const channel = supabase.channel(`kanban-${project.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `project_id=eq.${project.id}` }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects', filter: `id=eq.${project.id}` }, () => fetchData())
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [project.id])

  const updateColumnsInDB = async (newColumns: any[]) => {
    setColumns(newColumns) // Optimistic update
    const { error } = await supabase
      .from('projects')
      .update({ kanban_columns: newColumns })
      .eq('id', project.id)
    if (error) alert('Erro ao salvar colunas: ' + error.message)
  }

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    // 1. Atualização Otimista (Muda instantaneamente na tela)
    const previousTasks = [...tasks]
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t))

    // 2. Grava no banco em background
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId)
    
    // 3. Reverte se der erro
    if (error) {
      setTasks(previousTasks)
      alert('Erro ao atualizar status: ' + error.message)
    }
  }

  // --- Ações de Coluna ---
  const handleAddColumn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newColumnName.trim()) return

    const newCol = {
      id: `col_${Date.now()}`,
      label: newColumnName.trim(),
      color: 'border-border'
    }

    const newCols = [...columns]
    if (targetIndex !== null) {
      newCols.splice(targetIndex, 0, newCol)
    } else {
      newCols.push(newCol)
    }

    await updateColumnsInDB(newCols)
    setIsAddOpen(false)
    setNewColumnName('')
  }

  const handleRenameColumn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newColumnName.trim() || !targetColumn) return

    const newCols = columns.map(c => c.id === targetColumn.id ? { ...c, label: newColumnName.trim() } : c)
    await updateColumnsInDB(newCols)
    setIsRenameOpen(false)
    setNewColumnName('')
  }

  const handleDeleteColumn = async (colId: string) => {
    if (!confirm('Tem certeza? As tarefas desta coluna não serão excluídas, mas sumirão do quadro até serem reatribuídas.')) return
    const newCols = columns.filter(c => c.id !== colId)
    await updateColumnsInDB(newCols)
    setActiveDropdown(null)
  }

  // Fechar dropdowns ao clicar fora
  React.useEffect(() => {
    const closeDropdown = () => setActiveDropdown(null)
    window.addEventListener('click', closeDropdown)
    return () => window.removeEventListener('click', closeDropdown)
  }, [])

  return (
    <div className="p-8 h-full flex overflow-x-auto no-scrollbar animate-in fade-in duration-500">
      
      {/* Separador Inicial (Antes da primeira coluna) */}
      <div className="relative group w-8 shrink-0 flex justify-center cursor-pointer" onClick={() => { setTargetIndex(0); setIsAddOpen(true) }}>
        <div className="absolute inset-y-0 w-px bg-transparent group-hover:bg-primary/50 transition-colors" />
        <div className="absolute top-4 w-6 h-6 rounded-full bg-background border border-transparent group-hover:border-primary group-hover:text-primary flex items-center justify-center transition-all z-10 text-transparent opacity-0 group-hover:opacity-100 shadow-sm">
          <Plus className="w-3 h-3" />
        </div>
      </div>

      {columns.map((column, index) => (
        <React.Fragment key={column.id}>
          <div className="w-[350px] shrink-0 bg-sidebar/50 rounded-2xl border border-border flex flex-col overflow-visible h-full relative">
            {/* Column Header */}
            <div className={cn("p-4 border-b flex items-center justify-between bg-card/50 rounded-t-2xl", column.color)}>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm uppercase tracking-widest truncate max-w-[200px]">{column.label}</span>
                <span className="bg-muted px-2 py-0.5 rounded text-[10px] font-bold text-muted-foreground">
                  {tasks.filter(t => t.status === column.id).length}
                </span>
              </div>
              
              <div className="relative">
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === column.id ? null : column.id) }}
                  className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {activeDropdown === column.id && (
                  <div className="absolute top-full right-0 mt-1 w-40 bg-card border border-border rounded-xl shadow-xl z-50 py-1 overflow-hidden">
                    <button 
                      className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"
                      onClick={(e) => { e.stopPropagation(); setTargetColumn(column); setNewColumnName(column.label); setIsRenameOpen(true); setActiveDropdown(null) }}
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Renomear
                    </button>
                    <button 
                      className="w-full text-left px-4 py-2 text-sm hover:bg-red-500/10 text-red-400 hover:text-red-500 flex items-center gap-2"
                      onClick={(e) => { e.stopPropagation(); handleDeleteColumn(column.id) }}
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Excluir
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Task List */}
            <div 
              className={cn(
                "flex-1 p-4 space-y-4 overflow-y-auto transition-all rounded-b-2xl",
                dragOverColId === column.id ? "bg-primary/5 ring-inset ring-2 ring-primary/20" : ""
              )}
              onDragOver={(e) => {
                e.preventDefault()
                if (dragOverColId !== column.id) setDragOverColId(column.id)
              }}
              onDragLeave={() => setDragOverColId(null)}
              onDrop={(e) => {
                e.preventDefault()
                setDragOverColId(null)
                setDraggedTaskId(null)
                const taskId = e.dataTransfer.getData('taskId')
                // Prevenir atualizações desnecessárias
                const task = tasks.find(t => t.id === taskId)
                if (taskId && task && task.status !== column.id) {
                  updateTaskStatus(taskId, column.id)
                }
              }}
            >
              {tasks
                .filter((t) => t.status === column.id)
                .map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('taskId', task.id)
                      // O timeout é necessário para que a "sombra" original do navegador seja gerada 
                      // antes de mudarmos a opacidade do elemento na tela.
                      setTimeout(() => setDraggedTaskId(task.id), 0)
                    }}
                    onDragEnd={() => setDraggedTaskId(null)}
                    className={cn(
                      "bg-card border border-border p-5 rounded-2xl shadow-sm hover:border-primary/50 transition-all cursor-grab active:cursor-grabbing group relative z-0",
                      draggedTaskId === task.id ? "opacity-30 scale-95 shadow-none" : "opacity-100"
                    )}
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
                <div className="h-20 flex items-center justify-center text-muted-foreground/30 text-xs italic pointer-events-none">
                  Solte aqui
                </div>
              )}
            </div>
          </div>

          {/* Separador entre colunas */}
          <div className="relative group w-8 shrink-0 flex justify-center cursor-pointer" onClick={() => { setTargetIndex(index + 1); setIsAddOpen(true) }}>
            <div className="absolute inset-y-0 w-px bg-transparent group-hover:bg-primary/50 transition-colors" />
            <div className="absolute top-4 w-6 h-6 rounded-full bg-background border border-transparent group-hover:border-primary group-hover:text-primary flex items-center justify-center transition-all z-10 text-transparent opacity-0 group-hover:opacity-100 shadow-sm">
              <Plus className="w-3 h-3" />
            </div>
          </div>
        </React.Fragment>
      ))}

      {/* Modal Adicionar Coluna */}
      <Dialog isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Nova Coluna">
        <form onSubmit={handleAddColumn} className="space-y-6">
          <Input 
            autoFocus
            label="Nome da Coluna" 
            placeholder="Ex: Em Análise" 
            value={newColumnName} 
            onChange={e => setNewColumnName(e.target.value)} 
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setIsAddOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={!newColumnName.trim()}>Adicionar</Button>
          </div>
        </form>
      </Dialog>

      {/* Modal Renomear Coluna */}
      <Dialog isOpen={isRenameOpen} onClose={() => setIsRenameOpen(false)} title="Renomear Coluna">
        <form onSubmit={handleRenameColumn} className="space-y-6">
          <Input 
            autoFocus
            label="Novo Nome" 
            value={newColumnName} 
            onChange={e => setNewColumnName(e.target.value)} 
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setIsRenameOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={!newColumnName.trim() || newColumnName === targetColumn?.label}>Salvar</Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}
