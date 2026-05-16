'use client'

import * as React from 'react'
import { cn } from '@/features/core/utils/cn'
import { X } from 'lucide-react'

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  description?: string
}

export function Dialog({ isOpen, onClose, children, title, description }: DialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative bg-[#232221] border border-border w-full max-w-md rounded-2xl shadow-2xl p-8 space-y-6 animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2">
          {title && <h2 className="text-2xl font-bold">{title}</h2>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>

        {children}
      </div>
    </div>
  )
}
