'use client'

import * as React from 'react'
import { ChevronLeft, Rocket, Settings, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/features/core/components/ui/button'

interface ProjectHeaderProps {
  project: {
    id: string
    name: string
  }
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <header className="border-b border-border bg-background p-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>

        <div className="flex items-center gap-3">
          <div className="bg-muted p-2 rounded-xl border border-border">
            <Rocket className="w-6 h-6 text-primary fill-primary/10" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold leading-tight">{project.name}</h1>
            <button className="flex items-center gap-1 text-xs text-primary font-medium hover:opacity-80 transition-opacity">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Contexto: Geral (Todos)
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link href={`/project/${project.id}/settings`}>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
          </Button>
        </Link>
      </div>
    </header>
  )
}
