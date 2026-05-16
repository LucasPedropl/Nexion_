import * as React from 'react'
import { cn } from '@/features/core/utils/cn'
import type { NotificationCategory } from '../schemas/notification-schema'

interface NotificationTabsProps {
  activeTab: NotificationCategory
  onTabChange: (tab: NotificationCategory) => void
  unreadCount?: number
}

export function NotificationTabs({ activeTab, onTabChange, unreadCount = 0 }: NotificationTabsProps) {
  const tabs: { label: string; value: NotificationCategory; showBadge?: boolean }[] = [
    { label: 'Todas', value: 'all' },
    { label: 'Não lidas', value: 'unread', showBadge: unreadCount > 0 },
    { label: 'Sistema', value: 'system' },
    { label: 'Projetos', value: 'projects' },
    { label: 'Estoque & EPIs', value: 'inventory' },
  ]

  return (
    <div className="flex items-center gap-1 border-b border-border mb-6 overflow-x-auto pb-px">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={cn(
            "relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer",
            activeTab === tab.value
              ? "border-primary text-primary font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
          )}
        >
          {tab.label}
          {tab.showBadge && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
