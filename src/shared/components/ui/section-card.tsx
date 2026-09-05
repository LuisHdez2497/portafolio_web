import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface SectionCardProps {
  icon: LucideIcon
  title: string
  action?: ReactNode
  children: ReactNode
}

export function SectionCard({ icon: Icon, title, action, children }: SectionCardProps) {
  return (
    <section className="glass-panel mb-8 p-4 transition-all duration-300 hover:shadow-2xl sm:mb-16 sm:p-8">
      <div className="mb-6 flex items-center gap-3 sm:mb-8">
        <span className="rounded-lg bg-linear-to-r from-amber-500 to-yellow-500 p-2">
          <Icon className="h-5 w-5 text-black sm:h-6 sm:w-6" />
        </span>
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}
