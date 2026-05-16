import * as React from 'react'
import { cn } from '@/features/core/utils/cn'
import { AlertCircle, CheckCircle2, Info, Package, FolderGit2, Trash2, Check } from 'lucide-react'
import type { Notification } from '../schemas/notification-schema'

interface NotificationCardProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Agora mesmo'
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `Há ${diffInMinutes} min`
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `Há ${diffInHours} h`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) return 'Ontem'
  return `Há ${diffInDays} dias`
}

export function NotificationCard({ notification, onMarkAsRead, onDelete }: NotificationCardProps) {
  const getIconConfig = (type: string) => {
    switch (type) {
      case 'inventory':
      case 'warning':
        return { icon: Package, bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' }
      case 'project':
        return { icon: FolderGit2, bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20' }
      case 'success':
        return { icon: CheckCircle2, bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' }
      case 'alert':
        return { icon: AlertCircle, bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20' }
      default:
        return { icon: Info, bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/20' }
    }
  }

  const { icon: Icon, bg, text, border } = getIconConfig(notification.type)
  const relativeTime = getRelativeTime(notification.created_at)

  return (
    <div
      className={cn(
        "group relative flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-black/20",
        !notification.is_read ? "border-primary/40 bg-card/90" : "border-border"
      )}
    >
      {/* Ícone */}
      <div className={cn("p-2.5 rounded-xl border shrink-0 mt-0.5", bg, text, border)}>
        <Icon className="w-5 h-5" />
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className={cn("text-sm font-semibold truncate", !notification.is_read ? "text-foreground" : "text-muted-foreground")}>
            {notification.title}
          </h4>
          <span className="text-xs text-muted-foreground shrink-0 font-medium">
            {relativeTime}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {notification.description}
        </p>
      </div>

      {/* Ações / Indicador */}
      <div className="flex items-center gap-2 shrink-0 my-auto ml-2">
        {!notification.is_read && (
          <button
            onClick={() => onMarkAsRead(notification.id)}
            title="Marcar como lido"
            className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
          >
            <Check className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => onDelete(notification.id)}
          title="Excluir notificação"
          className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {!notification.is_read && (
          <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm shadow-primary/50 group-hover:hidden" />
        )}
      </div>
    </div>
  )
}
