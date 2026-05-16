'use client'

import * as React from 'react'
import { Layers, Users, Plus, Save } from 'lucide-react'
import { Input } from '@/features/core/components/ui/input'
import { Button } from '@/features/core/components/ui/button'

export function ArchitectureSettings({ project }: { project: any }) {
  const [modules, setModules] = React.useState(['Frontend', 'Backend', 'Mobile'])
  const [actors, setActors] = React.useState(['Admin', 'User', 'Guest'])

  return (
    <div className="max-w-4xl space-y-12 animate-in fade-in duration-500">
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Layers className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-xl font-bold">Estrutura & Atores</h2>
            <p className="text-sm text-muted-foreground">
              Defina os módulos do sistema e os tipos de usuário para organizar melhor suas tarefas e documentos.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Módulos */}
          <div className="bg-card border border-border p-6 rounded-2xl space-y-6">
            <h3 className="font-bold">Sub-sistemas (Módulos)</h3>
            <div className="flex gap-2">
              <Input placeholder="Ex: API Gateway" className="h-10" />
              <Button size="icon" variant="secondary" className="h-10 w-10 shrink-0">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {modules.map(mod => (
                <span key={mod} className="px-3 py-1.5 rounded-lg bg-muted border border-border text-xs font-medium text-primary flex items-center gap-2">
                  {mod}
                  <button className="hover:text-foreground">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Atores */}
          <div className="bg-card border border-border p-6 rounded-2xl space-y-6">
            <h3 className="font-bold">Atores (Tipos de Usuário)</h3>
            <div className="flex gap-2">
              <Input placeholder="Ex: Administrador" className="h-10" />
              <Button size="icon" variant="secondary" className="h-10 w-10 shrink-0">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {actors.map(actor => (
                <span key={actor} className="px-3 py-1.5 rounded-lg bg-muted border border-border text-xs font-medium text-sky-400 flex items-center gap-2">
                  {actor}
                  <button className="hover:text-foreground">×</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="gap-2">
            <Save className="w-4 h-4" />
            Salvar Estrutura
          </Button>
        </div>
      </section>
    </div>
  )
}
