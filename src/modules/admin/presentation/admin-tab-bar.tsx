import type { LucideIcon } from 'lucide-react'

export interface AdminTab {
  id: string
  label: string
  icon: LucideIcon
}

interface AdminTabBarProps {
  tabs: AdminTab[]
  activeId: string
  onSelect: (id: string) => void
}

export function AdminTabBar({ tabs, activeId, onSelect }: AdminTabBarProps) {
  return (
    <nav className="bottom-safe fixed inset-x-0 z-30 flex justify-center px-3" aria-label="Secciones del panel">
      <div className="glass-panel flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full p-1.5">
        {tabs.map((tab) => {
          const active = tab.id === activeId
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelect(tab.id)}
              aria-current={active ? 'page' : undefined}
              className={`flex min-w-[3.25rem] shrink-0 flex-col items-center gap-1 rounded-full px-2 py-2 text-[0.6rem] font-medium transition-colors ${
                active ? 'bg-amber-400/15 text-amber-300' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
