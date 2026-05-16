import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/features/core/lib/supabase/client'
import {
  fetchUserNotifications,
  markNotificationAsReadService,
  markAllNotificationsAsReadService,
  deleteNotificationService,
} from '../services/notification-service'
import type { Notification, NotificationCategory } from '../schemas/notification-schema'

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    user_id: 'mock-user-id',
    title: 'Estoque de EPI baixo: Capacete de Segurança',
    description: 'O estoque de Capacete de Segurança da Classe A atingiu o nível mínimo (5 unidades restantes). Recomenda-se solicitar reposição imediata.',
    type: 'inventory',
    category: 'inventory',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min atrás
  },
  {
    id: '2',
    user_id: 'mock-user-id',
    title: 'Novo documento adicionado ao projeto Alpha',
    description: 'O engenheiro Carlos Souza fez o upload do alvará atualizado e das plantas estruturais do setor B.',
    type: 'project',
    category: 'projects',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 horas atrás
  },
  {
    id: '3',
    user_id: 'mock-user-id',
    title: 'Manutenção programada para o Guindaste de Torre',
    description: 'A vistoria técnica mensal do Guindaste de Torre #02 está agendada para amanhã às 08:00h.',
    type: 'warning',
    category: 'system',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 horas atrás
  },
  {
    id: '4',
    user_id: 'mock-user-id',
    title: 'Aluguel de Betoneira concluído',
    description: 'A devolução da Betoneira 400L (Locação #4921) foi registrada com sucesso e inspecionada sem avarias.',
    type: 'success',
    category: 'system',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 dia atrás
  },
  {
    id: '5',
    user_id: 'mock-user-id',
    title: 'Atualização do Sistema Nexion v0.2',
    description: 'Novas funcionalidades de exportação de relatórios em PDF e controle de permissões em lote foram ativadas.',
    type: 'info',
    category: 'system',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 dias atrás
  },
]

export function useNotifications(initialCategory: NotificationCategory = 'all') {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [category, setCategory] = useState<NotificationCategory>(initialCategory)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const loadNotifications = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const { data, error: fetchError } = await fetchUserNotifications()

    if (fetchError || !data || data.length === 0) {
      // Fallback para mock data caso a tabela não exista ou esteja vazia
      setNotifications(MOCK_NOTIFICATIONS)
      if (fetchError && fetchError !== 'Usuário não autenticado') {
        console.warn('Tabela de notificações vazia ou inexistente no Supabase. Utilizando dados de demonstração.', fetchError)
      }
    } else {
      setNotifications(data)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadNotifications()

    // Realtime subscription
    const channel = supabase
      .channel('realtime:notifications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        () => {
          loadNotifications()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadNotifications])

  const handleMarkAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_read: true } : item))
    )
    await markNotificationAsReadService(id)
  }

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, is_read: true })))
    await markAllNotificationsAsReadService()
  }

  const handleDelete = async (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id))
    await deleteNotificationService(id)
  }

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (category === 'all') return true
      if (category === 'unread') return !item.is_read
      return item.category === category
    })
  }, [notifications, category])

  const unreadCount = useMemo(() => {
    return notifications.filter((item) => !item.is_read).length
  }, [notifications])

  return {
    notifications: filteredNotifications,
    category,
    setCategory,
    isLoading,
    error,
    unreadCount,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDelete,
    refresh: loadNotifications,
  }
}
