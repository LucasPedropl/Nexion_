'use client'

import * as React from 'react'
import { useTheme } from '@/features/core/providers/theme-provider'
import { cn } from '@/features/core/utils/cn'
import { Check, Link } from 'lucide-react'
import { Button } from '@/features/core/components/ui/button'

const themes = [
  { id: 'cosmic', name: 'Cosmic (Padrão)', bg: '#0F172A', primary: '#6366F1' },
  { id: 'dracula', name: 'Dracula', bg: '#282a36', primary: '#bd93f9' },
  { id: 'supabase', name: 'Supabase', bg: '#1c1c1c', primary: '#3ecf8e' },
  { id: 'cyberpunk', name: 'Cyberpunk', bg: '#0a0a12', primary: '#ff0055' },
  { id: 'matrix', name: 'Matrix', bg: '#000000', primary: '#008f11' },
  { id: 'forest', name: 'Forest', bg: '#061f1a', primary: '#10b981' },
  { id: 'ocean', name: 'Ocean', bg: '#082f49', primary: '#0ea5e9' },
  { id: 'sunset', name: 'Sunset (Laranja)', bg: '#1A1918', primary: '#F97316' },
  { id: 'midnight', name: 'Midnight (Dark)', bg: '#000000', primary: '#ffffff' },
]

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="p-10 space-y-12 max-w-6xl w-full mx-auto overflow-y-auto">
      <header>
        <h1 className="text-2xl font-bold">Configurações</h1>
      </header>

      {/* Contas Conectadas */}
      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Contas Conectadas</h2>
          <p className="text-sm text-muted-foreground">Gerencie vínculos com serviços externos.</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-muted p-3 rounded-xl">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold">GitHub</h3>
              <p className="text-sm text-muted-foreground">Vincule sua conta para sincronizar repositórios e organizações.</p>
            </div>
          </div>
          <Button variant="outline" className="gap-2">
            <Link className="w-4 h-4" />
            Conectar
          </Button>
        </div>
      </section>

      {/* Aparência & Tema */}
      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Aparência & Tema</h2>
          <p className="text-sm text-muted-foreground">Personalize a interface para se adequar ao seu estilo.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={cn(
                "group relative bg-card border border-border p-6 rounded-2xl text-left transition-all hover:border-primary",
                theme === t.id && "border-primary ring-1 ring-primary"
              )}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold">{t.name}</span>
                  {theme === t.id && (
                    <div className="bg-primary rounded-full p-1">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
                
                <div 
                  className="h-12 w-full rounded-lg border border-border flex items-center px-3"
                  style={{ backgroundColor: t.bg }}
                >
                  <div 
                    className="h-4 w-12 rounded-full"
                    style={{ backgroundColor: t.primary }}
                  />
                  <div className="ml-auto flex gap-1">
                    <div className="h-1.5 w-8 rounded-full bg-white/10" />
                    <div className="h-1.5 w-4 rounded-full bg-white/20" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
