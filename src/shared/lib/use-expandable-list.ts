import { useState } from 'react'

export interface ExpandableList<T> {
  visible: T[]
  hiddenCount: number
  isExpanded: boolean
  canExpand: boolean
  toggle: () => void
}

export function useExpandableList<T>(items: T[], previewCount: number): ExpandableList<T> {
  const [isExpanded, setIsExpanded] = useState(false)
  const canExpand = items.length > previewCount

  return {
    visible: canExpand && !isExpanded ? items.slice(0, previewCount) : items,
    hiddenCount: canExpand ? items.length - previewCount : 0,
    isExpanded,
    canExpand,
    toggle: () => setIsExpanded((value) => !value),
  }
}
