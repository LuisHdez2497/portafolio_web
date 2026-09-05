import { SpaceBackground } from './space-background'

interface ErrorFallbackProps {
  description: string
}

export function ErrorFallback({ description }: ErrorFallbackProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 text-center text-foreground">
      <SpaceBackground />
      <div className="glass-panel relative z-10 max-w-sm space-y-3 p-8">
        <h1 className="text-xl font-semibold text-white">Algo salió mal</h1>
        <p className="text-sm text-gray-400">{description}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="glass-cta mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-amber-500 to-yellow-500 px-5 py-2.5 font-semibold text-black transition-all hover:brightness-105"
        >
          Recargar
        </button>
      </div>
    </main>
  )
}
