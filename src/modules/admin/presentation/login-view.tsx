import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Loader2, Lock } from 'lucide-react'
import { SpaceBackground } from '@/shared/components/space-background'
import { FIELD_CLASS } from '@/shared/components/cms/cms-styles'
import { useAuth } from '../application/auth-store'
import { loginSchema, type LoginInput } from '../application/dto'

export function LoginView() {
  const { signIn } = useAuth()
  const [authError, setAuthError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(values: LoginInput) {
    setAuthError(null)
    try {
      await signIn(values.email, values.password)
    } catch {
      setAuthError('No se pudo iniciar sesión. Verifica tus credenciales.')
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 text-foreground">
      <SpaceBackground />
      <form onSubmit={handleSubmit(onSubmit)} className="glass-panel w-full max-w-sm space-y-5 p-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400 to-yellow-500">
            <Lock className="h-6 w-6 text-black" />
          </span>
          <h1 className="text-xl font-semibold">Acceso de administrador</h1>
        </div>
        <div className="space-y-1">
          <input type="email" placeholder="Correo electrónico" className={FIELD_CLASS} {...register('email')} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-1">
          <input type="password" placeholder="Contraseña" className={FIELD_CLASS} {...register('password')} />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>
        {authError && <p className="text-sm text-destructive">{authError}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="glass-cta flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-amber-500 to-yellow-500 px-4 py-2.5 font-semibold text-black transition-all duration-300 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </main>
  )
}
