import { useState } from 'react'

export interface ListEditorSelection {
  selectedId: string | null
  isNew: boolean
  selectRow: (id: string) => void
  addNew: () => void
  close: () => void
}

export function useListEditorSelection(): ListEditorSelection {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isNew, setIsNew] = useState(false)

  return {
    selectedId,
    isNew,
    selectRow: (id) => {
      setSelectedId(id)
      setIsNew(false)
    },
    addNew: () => {
      setSelectedId(null)
      setIsNew(true)
    },
    close: () => {
      setSelectedId(null)
      setIsNew(false)
    },
  }
}
