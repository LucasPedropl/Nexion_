import { createClient } from '@/features/core/lib/supabase/client'

export async function signInWithSocial(provider: 'google' | 'github', nextUrl?: string) {
  const supabase = createClient()
  const origin = window.location.origin

  let callbackUrl = `${origin}/auth/callback`
  if (nextUrl) {
    callbackUrl += `?next=${encodeURIComponent(nextUrl)}`
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: callbackUrl,
    },
  })

  if (error) {
    alert('Erro ao iniciar login social: ' + error.message)
  }
}
