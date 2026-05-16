import { createClient } from '@/features/core/lib/supabase/client'
import type { Notification } from '../schemas/notification-schema'

export async function fetchUserNotifications(): Promise<{ data: Notification[] | null; error: string | null }> {
  try {
    const supabase = createClient()
    const { data: userData } = await supabase.auth.getUser()
    
    if (!userData.user) {
      return { data: null, error: 'Usuário não autenticado' }
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return { data: null, error: error.message }
    }

    return { data: data as Notification[], error: null }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar notificações'
    return { data: null, error: errorMessage }
  }
}

export async function markNotificationAsReadService(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Erro ao marcar notificação como lida'
    return { success: false, error: errorMessage }
  }
}

export async function markAllNotificationsAsReadService(): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = createClient()
    const { data: userData } = await supabase.auth.getUser()
    
    if (!userData.user) {
      return { success: false, error: 'Usuário não autenticado' }
    }

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userData.user.id)
      .eq('is_read', false)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Erro ao marcar todas como lidas'
    return { success: false, error: errorMessage }
  }
}

export async function deleteNotificationService(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir notificação'
    return { success: false, error: errorMessage }
  }
}
