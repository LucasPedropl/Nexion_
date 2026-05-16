'use client'

import * as React from 'react'
import { Search, Plus } from "lucide-react"
import { Button } from "@/features/core/components/ui/button"
import { Dialog } from '@/features/core/components/ui/dialog'
import { CreateProjectForm } from '@/features/projects/components/create-project-form'
import { createClient } from '@/features/core/lib/supabase/client'
import Link from 'next/link'

interface DashboardProps {
  initialProfile: { name: string }
}

export function DashboardContent({ initialProfile }: DashboardProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [projects, setProjects] = React.useState<any[]>([])
  const [search, setSearch] = React.useState('')
  const supabase = createClient()

  const firstName = initialProfile.name.split(' ')[0] || 'Dev'

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setProjects(data)
  }

  React.useEffect(() => {
    fetchProjects()

    const channel = supabase
      .channel('dashboard-changes')
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

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-10 space-y-10 max-w-6xl w-full mx-auto overflow-y-auto">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold">Bem-vindo, {firstName}.</h1>
        <p className="text-muted-foreground text-lg">
          Gerencie seu fluxo de desenvolvimento, reuniões e documentação em um só lugar.
        </p>
      </header>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Projetos Ativos</h2>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Buscar projetos..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-muted border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary w-64"
              />
            </div>
            <Button variant="primary" className="gap-2" onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4" />
              Novo Projeto
            </Button>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="border-2 border-dashed border-border rounded-2xl h-[400px] flex flex-col items-center justify-center text-center space-y-4">
            <p className="text-muted-foreground">
              {search ? 'Nenhum projeto encontrado para esta busca.' : 'Nenhum projeto encontrado. Crie um para começar.'}
            </p>
            {!search && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-primary hover:underline text-sm font-medium"
              >
                Criar Projeto →
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Link 
                key={project.id} 
                href={`/project/${project.id}`}
                className="bg-card border border-border p-6 rounded-2xl hover:border-primary transition-colors group cursor-pointer block"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-muted p-3 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                      <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold truncate">{project.name}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Criado em {new Date(project.created_at).toLocaleDateString('pt-BR')}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

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
    </div>
  )
}
