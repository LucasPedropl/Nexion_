'use client'

import * as React from 'react'
import { createClient } from '@/features/core/lib/supabase/client'
import { Bell, Check, X, Rocket, Clock } from 'lucide-react'
import { Button } from '@/features/core/components/ui/button'
import { cn } from '@/features/core/utils/cn'

export default function NotificationsPage() {
  const [invitations, setInvitations] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const supabase = createClient()

  const fetchInvitations = async () => {
    setIsLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('project_invitations')
      .select('*, projects(name), profiles:invited_by(name, nickname)')
      .eq('status', 'pending')
    
    if (error) console.error('Erro ao buscar convites:', error)
    else setInvitations(data || [])
    setIsLoading(false)
  }

  React.useEffect(() => {
    fetchInvitations()
  }, [])

  const handleResponse = async (id: string, status: 'accepted' | 'declined') => {
    const { error } = await supabase
      .from('project_invitations')
      .update({ status })
      .eq('id', id)

    if (error) {
      alert('Erro ao responder convite: ' + error.message)
    } else {
      setInvitations(prev => prev.filter(inv => inv.id !== id))
    }
  }

  return (
    <div className="p-10 space-y-10 max-w-4xl w-full mx-auto overflow-y-auto">
      <header className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-2xl">
          <Bell className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Notificações</h1>
          <p className="text-muted-foreground">Gerencie seus convites e alertas do sistema.</p>
        </div>
      </header>

      <div className="space-y-6">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          Convites de Projeto ({invitations.length})
        </h2>

        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground">Carregando convites...</div>
        ) : invitations.length === 0 ? (
          <div className="border-2 border-dashed border-border rounded-3xl p-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="bg-muted p-4 rounded-full">
              <Rocket className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground font-medium">Tudo limpo por aqui!<br/>Você não tem convites pendentes no momento.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {invitations.map((inv) => (
              <div 
                key={inv.id} 
                className="bg-card border border-border p-6 rounded-2xl flex items-center justify-between group hover:border-primary transition-all shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {inv.projects?.name?.[0].toUpperCase()}
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-lg">
                      Convite para: <span className="text-primary">{inv.projects?.name}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Enviado por <span className="text-foreground font-medium">@{inv.profiles?.nickname}</span> ({inv.profiles?.name})
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                       <Clock className="w-3 h-3" /> {new Date(inv.created_at).toLocaleDateString('pt-BR')} • Cargo: {inv.role}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button 
                    variant="secondary" 
                    className="hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 transition-all px-6"
                    onClick={() => handleResponse(inv.id, 'declined')}
                  >
                    <X className="w-4 h-4 mr-2" /> Recusar
                  </Button>
                  <Button 
                    className="px-6 shadow-orange-500/20 shadow-lg"
                    onClick={() => handleResponse(inv.id, 'accepted')}
                  >
                    <Check className="w-4 h-4 mr-2" /> Aceitar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
