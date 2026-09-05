import type { VisitEventType } from '../domain/entities'
import { EVENT_TEXT } from './visit-format'
import type { VisitFilter, VisitsSummary } from './visit-analytics'

const CHIP = 'shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors'
const CHIP_ON = 'border-amber-400/50 bg-amber-400/15 text-amber-200'
const CHIP_OFF = 'border-white/[0.1] bg-white/[0.04] text-gray-300 hover:border-white/20'

function typeActive(filter: VisitFilter | null, type: VisitEventType): boolean {
  return filter?.kind === 'type' && filter.value === type
}

function countryActive(filter: VisitFilter | null, country: string): boolean {
  return filter?.kind === 'country' && filter.value === country
}

interface VisitsSummaryBarProps {
  summary: VisitsSummary
  filter: VisitFilter | null
  onFilter: (filter: VisitFilter | null) => void
}

export function VisitsSummaryBar({ summary, filter, onFilter }: VisitsSummaryBarProps) {
  const types = Object.entries(summary.byType) as [VisitEventType, number][]

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => onFilter(null)} className={`${CHIP} ${filter === null ? CHIP_ON : CHIP_OFF}`}>
          Todas · {summary.total}
        </button>
        {types.map(([type, count]) => (
          <button
            key={type}
            type="button"
            title={EVENT_TEXT[type].label}
            onClick={() => onFilter(typeActive(filter, type) ? null : { kind: 'type', value: type })}
            className={`${CHIP} ${typeActive(filter, type) ? CHIP_ON : CHIP_OFF}`}
          >
            {EVENT_TEXT[type].emoji} {count}
          </button>
        ))}
      </div>
      {summary.topCountries.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {summary.topCountries.map(({ country, count }) => (
            <button
              key={country}
              type="button"
              onClick={() => onFilter(countryActive(filter, country) ? null : { kind: 'country', value: country })}
              className={`${CHIP} ${countryActive(filter, country) ? CHIP_ON : CHIP_OFF}`}
            >
              📍 {country} · {count}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
