'use client'

import * as React from 'react'
import { Users, Link as LinkIcon, AtSign, Crown, MoreHorizontal } from 'lucide-react'

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

import { Button } from '@/features/core/components/ui/button'
import { createClient } from '@/features/core/lib/supabase/client'
import { cn } from '@/features/core/utils/cn'

export function TeamSettings({ project }: { project: any }) {
  const [members, setMembers] = React.useState<any[]>([])
  const [inviteNick, setInviteNick] = React.useState('')
  const [suggestions, setSuggestions] = React.useState<any[]>([])
  const [selectedUser, setSelectedUser] = React.useState<any>(null)
  const [inviteRole, setInviteRole] = React.useState('collaborator')
  const [isLoading, setIsLoading] = React.useState(false)
  const supabase = createClient()

  const fetchMembers = async () => {
    const { data } = await supabase
      .from('project_members')
      .select('*, profiles(*)')
      .eq('project_id', project.id)
      .order('joined_at', { ascending: true })
    if (data) setMembers(data)
  }

  React.useEffect(() => {
    fetchMembers()
  }, [project.id])

  // Busca em tempo real de usuários
  React.useEffect(() => {
    const searchUsers = async () => {
      if (inviteNick.length < 2 || selectedUser) {
        setSuggestions([])
        return
      }

      console.log('Buscando usuários por:', inviteNick)

      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, nickname, email')
        .or(`nickname.ilike.%${inviteNick}%,email.ilike.%${inviteNick}%,name.ilike.%${inviteNick}%`)
        .limit(5)
      
      if (error) {
        console.error('Erro na busca:', error)
        return
      }

      console.log('Usuários encontrados:', data)
      
      // Filtrar usuários que já são membros
      const filtered = (data || []).filter(u => !members.some(m => m.user_id === u.id))
      setSuggestions(filtered)
    }

    const timer = setTimeout(searchUsers, 300)
    return () => clearTimeout(timer)
  }, [inviteNick, members, selectedUser])

  const handleInvite = async () => {
    const userToInvite = selectedUser || suggestions[0]
    if (!userToInvite) {
      alert('Selecione um usuário válido da lista.')
      return
    }
    
    setIsLoading(true)
    
    // 2. Criar convite pendente
    const { data: userData } = await supabase.auth.getUser()
    const { error } = await supabase
      .from('project_invitations')
      .insert({
        project_id: project.id,
        invited_by: userData.user?.id,
        email: userToInvite.email,
        nickname: userToInvite.nickname,
        role: inviteRole,
        status: 'pending'
      })

    if (error) {
      alert('Erro ao enviar convite: ' + error.message)
    } else {
      alert('Convite enviado com sucesso!')
      setInviteNick('')
      setSelectedUser(null)
      setSuggestions([])
    }
    setIsLoading(false)
  }

  const roleLabels: any = {
    owner: 'DONO DO PROJETO',
    admin: 'ADMINISTRADOR',
    collaborator: 'COLABORADOR',
    reader: 'LEITOR'
  }

  return (
    <div className="max-w-4xl space-y-12 animate-in fade-in duration-500">
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-xl font-bold">Gerenciar Acesso</h2>
            <p className="text-sm text-muted-foreground">Convide membros ou sincronize com o GitHub.</p>
          </div>
        </div>

        {/* GitHub Sync */}
        <div className="bg-card border border-border p-8 rounded-2xl space-y-6 opacity-60">
          <div className="flex items-center gap-3">
            <GithubIcon className="w-5 h-5" />
            <h3 className="font-bold">Sincronizar com Organização GitHub</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Você precisa conectar sua conta do GitHub nas configurações globais para usar este recurso.
          </p>
        </div>

        {/* Invite Form */}
        <div className="bg-card border border-border p-8 rounded-2xl space-y-6">
          <h3 className="font-bold">Convidar por Nickname ou Email</h3>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                value={inviteNick}
                onChange={(e) => {
                  setInviteNick(e.target.value)
                  setSelectedUser(null)
                }}
                placeholder="Buscar nick ou email (ex: dev_ninja)"
                className="w-full bg-input border border-border rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
              />

              {/* Lista de Sugestões */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl z-20 overflow-hidden">
                  {suggestions.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setSelectedUser(u)
                        setInviteNick(`@${u.nickname}`)
                        setSuggestions([])
                      }}
                      className="w-full p-3 flex items-center gap-3 hover:bg-muted text-left transition-colors border-b border-border/50 last:border-0"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        {u.name[0].toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-sm truncate">@{u.nickname}</span>
                        <span className="text-[10px] text-muted-foreground truncate">{u.email}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <select 
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="bg-input border border-border rounded-lg px-4 py-3 text-sm outline-none cursor-pointer hover:border-primary transition-colors"
            >
              <option value="collaborator">Colaborador</option>
              <option value="admin">Administrador</option>
              <option value="reader">Leitor</option>
            </select>

            <Button 
              onClick={handleInvite} 
              disabled={isLoading || (!inviteNick && !selectedUser)}
              className="gap-2 px-8"
            >
              {isLoading ? 'Convidando...' : '+ Convidar'}
            </Button>
          </div>
        </div>

        {/* Member List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Membros Ativos ({members.length})
          </div>

          <div className="space-y-3">
            {members.map((member) => (
              <div key={member.id} className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between group hover:border-primary/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-lg font-bold text-white shadow-lg">
                    {member.profiles?.name?.[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">@{member.profiles?.nickname}</span>
                      {member.role === 'owner' && <Crown className="w-3 h-3 text-yellow-500" />}
                      {member.user_id === project.user_id && <span className="bg-muted px-2 py-0.5 rounded text-[10px] text-muted-foreground">Você</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn(
                        "text-[9px] font-bold px-2 py-0.5 rounded border tracking-widest",
                        member.role === 'owner' ? "text-yellow-500 border-yellow-500/30" : "text-muted-foreground border-border"
                      )}>
                        {roleLabels[member.role]}
                      </span>
                    </div>
                  </div>
                </div>
                
                {member.role !== 'owner' && (
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
