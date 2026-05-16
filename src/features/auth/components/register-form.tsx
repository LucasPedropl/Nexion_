'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterInput } from '../schemas/auth-schema'
import { signup } from '../services/auth-service'
import { signInWithSocial } from '../services/auth-social-client'
import { Button } from '@/features/core/components/ui/button'
import { Input } from '@/features/core/components/ui/input'
import { Mail, Lock, User, AtSign } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export function RegisterForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('next') || undefined
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    setError(null)
    const result = await signup(data, redirectTo)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-sm">
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          className="flex-1 gap-2" 
          type="button"
          onClick={() => signInWithSocial('github', redirectTo)}
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          GitHub
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 gap-2" 
          type="button"
          onClick={() => signInWithSocial('google', redirectTo)}
        >
          <img src="/google.svg" alt="Google" className="w-5 h-5" />
          Google
        </Button>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <span className="relative bg-[#232221] px-2 text-xs text-muted-foreground uppercase">ou preencha os dados</span>
      </div>

      <div className="space-y-4 text-left">
        <Input
          {...register('name')}
          label="Nome completo"
          placeholder="Seu Nome"
          icon={<User className="w-5 h-5" />}
          error={errors.name?.message}
        />
        <Input
          {...register('nickname')}
          label="Nickname"
          placeholder="seu_nickname"
          icon={<AtSign className="w-5 h-5" />}
          error={errors.nickname?.message}
        />
        <Input
          {...register('email')}
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          icon={<Mail className="w-5 h-5" />}
          error={errors.email?.message}
        />
        <Input
          {...register('password')}
          label="Senha"
          type="password"
          placeholder="••••••••"
          icon={<Lock className="w-5 h-5" />}
          error={errors.password?.message}
        />
      </div>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <Button type="submit" fullWidth disabled={isLoading}>
        {isLoading ? 'Criando conta...' : 'Cadastrar →'}
      </Button>

      <p className="text-sm text-center text-muted-foreground">
        Já tem uma conta? <Link href={redirectTo ? `/login?next=${encodeURIComponent(redirectTo)}` : '/login'} className="text-primary hover:underline">Entre aqui</Link>
      </p>
    </form>
  )
}
