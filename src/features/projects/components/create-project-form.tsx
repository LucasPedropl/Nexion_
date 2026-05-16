'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/features/core/components/ui/button'
import { Input } from '@/features/core/components/ui/input'
import { createProject } from '../services/project-service'

const projectSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
})

type ProjectInput = z.infer<typeof projectSchema>

interface CreateProjectFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function CreateProjectForm({ onSuccess, onCancel }: CreateProjectFormProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
  })

  const onSubmit = async (data: ProjectInput) => {
    setIsLoading(true)
    setError(null)
    const result = await createProject(data.name)
    
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Input
        {...register('name')}
        label="Nome do Projeto"
        placeholder="Ex: API Gateway V2"
        error={errors.name?.message}
        autoFocus
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-4 justify-end">
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? 'Criando...' : 'Criar Projeto'}
        </Button>
      </div>
    </form>
  )
}
