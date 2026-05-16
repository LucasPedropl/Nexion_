import * as React from 'react'
import { NotificationCard } from './notification-card'
import { BellRing, Loader2 } from 'lucide-react'
import type { Notification } from '../schemas/notification-schema'

interface NotificationListProps {
  notifications: Notification[]
  isLoading: boolean
  error: string | null
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}

export function NotificationList({
  notifications,
  isLoading,
  error,
  onMarkAsRead,
  onDelete,
}: NotificationListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Carregando notificações...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-red-500/10 border border-red-500/20 rounded-2xl max-w-md mx-auto text-center gap-2">
        <p className="text-sm font-semibold text-red-500">Erro ao carregar notificações</p>
        <p className="text-xs text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center gap-4 bg-card/50 border border-border rounded-2xl">
        <div className="p-4 rounded-full bg-muted text-muted-foreground">
          <BellRing className="w-8 h-8 opacity-50" />
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="text-base font-semibold text-foreground">Nenhuma notificação encontrada</h3>
          <p className="text-xs text-muted-foreground">
            Você está em dia! Novas atualizações sobre estoque de EPIs, projetos e aluguéis aparecerão aqui.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {notifications.map((item) => (
        <NotificationCard
          key={item.id}
          notification={item}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
