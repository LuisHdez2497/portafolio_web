import type { ElementType, ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  as?: ElementType
  accent?: boolean
  interactive?: boolean
  className?: string
}

export function GlassCard({
  children,
  as: Tag = 'div',
  accent = false,
  interactive = false,
  className = '',
}: GlassCardProps) {
  const accentClass = accent ? ' border-l-2 border-l-amber-400/70' : ''
  const hoverClass = interactive ? ' transition-colors hover:border-amber-400/30' : ''
  return (
    <Tag className={`rounded-xl border border-white/[0.08] bg-white/[0.05] p-5${accentClass}${hoverClass} ${className}`}>
      {children}
    </Tag>
  )
}
