'use client'

import * as React from 'react'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

interface ProjectSettingsHeaderProps {
  project: {
    id: string
    name: string
  }
}

export function ProjectSettingsHeader({ project }: ProjectSettingsHeaderProps) {
  return (
    <header className="border-b border-border bg-background p-4 flex items-center shrink-0">
      <Link 
        href={`/project/${project.id}`} 
        className="text-muted-foreground hover:text-foreground transition-colors mr-4"
      >
        <ChevronLeft className="w-6 h-6" />
      </Link>
      <h1 className="text-xl font-bold">Configurações do Projeto: {project.name}</h1>
    </header>
  )
}
