'use server'

import { createClient } from '@/features/core/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProject(name: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Não autorizado')

  const { error } = await supabase.from('projects').insert({
    name,
    user_id: user.id
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function getProjects() {
  const supabase = await createClient()

  // Com o RLS atualizado, o Supabase filtrará automaticamente os projetos 
  // onde o usuário é dono OU membro.
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar projetos:', error)
    return []
  }
  return data
}
