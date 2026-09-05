import type { ReactNode } from 'react'

interface EditorSectionProps {
  title: string
  description?: string
  children: ReactNode
}

export function EditorSection({ title, description, children }: EditorSectionProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight text-white">{title}</h2>
        {description && <p className="text-sm text-gray-400">{description}</p>}
      </div>
      <div className="glass-panel p-5 sm:p-6">{children}</div>
    </section>
  )
}
