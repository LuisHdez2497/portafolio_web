import { Loader2 } from 'lucide-react'

export function LoadingScreen() {
  return (
    <div className="bg-space flex min-h-screen items-center justify-center px-4">
      <Loader2 className="h-12 w-12 animate-spin text-amber-400" />
    </div>
  )
}
