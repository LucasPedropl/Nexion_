'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/features/core/components/ui/button'
import { Input } from '@/features/core/components/ui/input'
import { createClient } from '@/features/core/lib/supabase/client'

const taskSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  assigned_to: z.string().optional(),
})

type TaskInput = z.infer<typeof taskSchema>

interface CreateTaskFormProps {
  project: any
  onSuccess: () => void
  onCancel: () => void
}

export function CreateTaskForm({ project, onSuccess, onCancel }: CreateTaskFormProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [members, setMembers] = React.useState<any[]>([])
  const supabase = createClient()

  React.useEffect(() => {
    const fetchMembers = async () => {
      const { data } = await supabase
        .from('project_members')
        .select('*, profiles(id, name, nickname)')
        .eq('project_id', project.id)
      if (data) setMembers(data)
    }
    fetchMembers()
  }, [project.id])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
  })

  const onSubmit = async (data: TaskInput) => {
    setIsLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    const { error } = await supabase
      .from('tasks')
      .insert({
        project_id: project.id,
        title: data.title,
        description: data.description,
        assigned_to: data.assigned_to || null,
        created_by: user.id,
        status: 'todo'
      })

    if (error) {
      alert('Erro ao criar tarefa: ' + error.message)
    } else {
      onSuccess()
    }
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        {...register('title')}
        label="Título da Tarefa"
        placeholder="Ex: Desenvolver API de Login"
        error={errors.title?.message}
        autoFocus
      />

      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Descrição (Opcional)
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full bg-input border border-border rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary outline-none"
          placeholder="Dê mais detalhes sobre a tarefa..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Atribuir para
        </label>
        <select
          {...register('assigned_to')}
          className="w-full bg-input border border-border rounded-lg px-4 py-3 text-sm outline-none cursor-pointer hover:border-primary transition-colors appearance-none"
        >
          <option value="">Ninguém (Não atribuído)</option>
          {members.map(m => (
            <option key={m.user_id} value={m.user_id}>
              {m.profiles?.name} (@{m.profiles?.nickname})
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4 justify-end">
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? 'Criando...' : 'Criar Tarefa'}
        </Button>
      </div>
    </form>
  )
}
