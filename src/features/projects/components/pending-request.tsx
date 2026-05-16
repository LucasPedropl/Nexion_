'use client'

import * as React from 'react'
import { Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/features/core/components/ui/button'

export function PendingRequest() {
  const [timeLeft, setTimeLeft] = React.useState(5)

  React.useEffect(() => {
    if (timeLeft <= 0) {
      window.location.assign('/')
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-center gap-3 justify-center text-amber-500">
        <Clock className="w-5 h-5" />
        <span className="font-bold text-sm">SOLICITAÇÃO PENDENTE</span>
      </div>
      
      <p className="text-sm text-muted-foreground leading-relaxed">
        Sua solicitação de entrada já foi enviada. <br/>Aguarde o dono do projeto aprovar seu acesso.
      </p>
      
      <div className="pt-4 space-y-4">
        <Link href="/" className="block">
          <Button 
            variant="outline" 
            fullWidth 
            className="h-14 text-base border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground shadow-lg shadow-primary/10 transition-all"
          >
            Voltar para o Dashboard
          </Button>
        </Link>
        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest animate-pulse">
          Redirecionando automaticamente em {timeLeft}s...
        </p>
      </div>
    </div>
  )
}
