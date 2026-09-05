import { describe, expect, it } from 'vitest'
import { parseEnv } from './env'

const validEnv = {
  VITE_FIREBASE_API_KEY: 'api-key',
  VITE_FIREBASE_AUTH_DOMAIN: 'app.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'project',
  VITE_FIREBASE_STORAGE_BUCKET: 'app.appspot.com',
  VITE_FIREBASE_MESSAGING_SENDER_ID: '123456',
  VITE_FIREBASE_APP_ID: '1:123:web:abc',
  VITE_ADMIN_EMAIL: 'admin@example.com',
}

describe('parseEnv', () => {
  it('acepta una configuración completa y válida', () => {
    expect(parseEnv(validEnv)).toMatchObject(validEnv)
  })

  it('lanza si falta una variable de Firebase', () => {
    const { VITE_FIREBASE_API_KEY: _omit, ...incomplete } = validEnv
    expect(() => parseEnv(incomplete)).toThrow(/inválidas o faltantes/)
  })

  it('lanza si el email de admin no es válido', () => {
    expect(() => parseEnv({ ...validEnv, VITE_ADMIN_EMAIL: 'no-es-email' })).toThrow()
  })
})
