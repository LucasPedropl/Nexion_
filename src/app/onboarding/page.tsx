'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/features/core/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/features/core/components/ui/button'
import { Input } from '@/features/core/components/ui/input'
import { AtSign } from 'lucide-react'

const schema = z.object({
  nickname: z.string()
    .min(3, 'Nickname deve ter pelo menos 3 caracteres')
    .regex(/^[a-z0-9_]+$/, 'Use apenas letras minúsculas, números e sublinhados')
})

function OnboardingContent() {
  const searchParams = useSearchParams()
  const nextUrl = searchParams.get('next') || '/'
  const [isLoading, setIsLoading] = React.useState(false)
  const [isChecking, setIsChecking] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  React.useEffect(() => {
    const checkProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user

      if (!user) {
        console.log('Sem sessão no onboarding, aguardando ou redirecionando...')
        setIsChecking(false)
        return
      }

      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('id', user.id)
      
      if (error) {
        console.error('Erro ao verificar perfil:', error)
      }

      if (profiles && profiles.length > 0 && profiles[0].nickname) {
        console.log('Nickname já existe:', profiles[0].nickname)
        window.location.assign(nextUrl)
      } else {
        setIsChecking(false)
      }
    }
    checkProfile()
  }, [nextUrl])

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      
      if (!user) {
        setError('Sessão expirada. Recarregue a página.')
        setIsLoading(false)
        return
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ nickname: data.nickname })
        .eq('id', user.id)

      if (updateError) {
        console.error('Erro update:', updateError)
        if (updateError.code === '23505') setError('Este nickname já está em uso.')
        else setError('Erro ao salvar: ' + updateError.message)
        setIsLoading(false)
      } else {
        console.log('Sucesso! Redirecionando para:', nextUrl)
        window.location.assign(nextUrl)
      }
    } catch (e: any) {
      setError('Ocorreu um erro inesperado.')
      setIsLoading(false)
    }
  }

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Verificando perfil...
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm flex flex-col items-center text-center space-y-8">
        <div className="bg-primary p-3 rounded-xl">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-white fill-current">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Quase lá!</h1>
          <p className="text-muted-foreground">
            Escolha um nickname exclusivo para sua conta no Nexion.
          </p>
        </div>

        <div className="w-full bg-[#232221] p-8 rounded-2xl border border-border shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              {...register('nickname')}
              label="Nickname"
              placeholder="seu_nickname"
              icon={<AtSign className="w-5 h-5" />}
              error={errors.nickname?.message as string}
              autoFocus
            />

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Finalizar Cadastro'}
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default function OnboardingPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">Carregando...</div>}>
      <OnboardingContent />
    </React.Suspense>
  )
}
