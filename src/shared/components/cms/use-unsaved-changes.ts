import { useEffect } from 'react'
import { create } from 'zustand'
import { confirmDialog } from '@/shared/components/ui/confirm-store'

interface UnsavedState {
  dirty: boolean
  setDirty: (dirty: boolean) => void
}

export const useUnsavedStore = create<UnsavedState>((set) => ({
  dirty: false,
  setDirty: (dirty) => set({ dirty }),
}))

export function useTrackDirty(isDirty: boolean): void {
  const setDirty = useUnsavedStore((state) => state.setDirty)
  useEffect(() => {
    setDirty(isDirty)
    return () => setDirty(false)
  }, [isDirty, setDirty])
}

export async function confirmDiscardIfDirty(): Promise<boolean> {
  const { dirty, setDirty } = useUnsavedStore.getState()
  if (dirty) {
    const ok = await confirmDialog('Tienes cambios sin guardar. ¿Descartarlos?', {
      confirmLabel: 'Descartar',
      danger: true,
    })
    if (!ok) return false
  }
  setDirty(false)
  return true
}
