'use server'

import { createClient } from '@/features/core/lib/supabase/server'
import { redirect } from 'next/navigation'
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '../schemas/auth-schema'

export async function login(formData: LoginInput) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword(formData)

  if (error) {
    return { error: error.message }
  }

  redirect('/')
}

export async function signup(formData: RegisterInput) {
  const supabase = await createClient()

  // 1. Criar o usuário no Auth
  const { data, error: authError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  })

  if (authError) return { error: authError.message }
  if (!data.user) return { error: 'Erro ao criar usuário' }

  // 2. Criar o perfil na tabela profiles
  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    name: formData.name,
    nickname: formData.nickname,
    email: formData.email,
  })

  if (profileError) {
    // Idealmente aqui deletaríamos o user do auth se falhar, mas o RLS/Trigger resolveria melhor.
    return { error: 'Erro ao criar perfil: ' + profileError.message }
  }

  redirect('/')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
