import { NextResponse } from 'next/server'
import { createClient } from '@/features/core/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Verificar se o usuário já tem perfil
      const { data: profile } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('id', data.user.id)
        .single()

      // Se não tem perfil, cria um básico ou redireciona para onboarding
      if (!profile) {
        // Criamos o perfil sem nickname inicialmente
        await supabase.from('profiles').upsert({
          id: data.user.id,
          name: data.user.user_metadata.full_name || data.user.user_metadata.name || 'Usuário',
          email: data.user.email!,
          avatar_url: data.user.user_metadata.avatar_url,
        })
        
        let onboardingUrl = `${origin}/onboarding`
        if (next && next !== '/') {
          onboardingUrl += `?next=${encodeURIComponent(next)}`
        }
        return NextResponse.redirect(onboardingUrl)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Se houver erro, volta para login
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
