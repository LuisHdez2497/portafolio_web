import { create } from 'zustand'

export interface ConfirmOptions {
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}

interface ConfirmRequest extends ConfirmOptions {
  resolve: (ok: boolean) => void
}

interface ConfirmState {
  request: ConfirmRequest | null
  open: (options: ConfirmOptions) => Promise<boolean>
  respond: (ok: boolean) => void
}

export const useConfirmStore = create<ConfirmState>((set, get) => ({
  request: null,
  open: (options) => new Promise<boolean>((resolve) => set({ request: { ...options, resolve } })),
  respond: (ok) => {
    const { request } = get()
    if (request) request.resolve(ok)
    set({ request: null })
  },
}))

export function confirmDialog(message: string, options: Omit<ConfirmOptions, 'message'> = {}): Promise<boolean> {
  return useConfirmStore.getState().open({ message, ...options })
}
