'use client'

import * as React from 'react'
import { createClient } from '@/features/core/lib/supabase/client'

interface ThemeContextType {
  theme: string
  setTheme: (theme: string) => void
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children, initialTheme }: { children: React.ReactNode, initialTheme: string }) {
  const [theme, setThemeState] = React.useState(initialTheme)
  const supabase = createClient()

  const setTheme = async (newTheme: string) => {
    setThemeState(newTheme)
    
    // Persistir no Supabase
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('profiles')
        .update({ theme: newTheme })
        .eq('id', user.id)
    }
  }

  React.useEffect(() => {
    // Aplicar a classe do tema ao body
    const body = document.body
    body.className = '' // Reset
    if (theme && theme !== 'sunset') {
      body.classList.add(`theme-${theme}`)
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
