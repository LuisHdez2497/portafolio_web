import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { auth } from '@/shared/firebase'
import type { AdminUser } from '../domain/entities'
import type { AuthRepository } from '../domain/interfaces'

function toAdminUser(user: User | null): AdminUser | null {
  if (!user) {
    return null
  }
  return {
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
  }
}

export function createAuthRepository(): AuthRepository {
  return {
    async signIn(email, password) {
      await signInWithEmailAndPassword(auth, email, password)
    },
    async signOut() {
      await signOut(auth)
    },
    observe(onChange) {
      return onAuthStateChanged(auth, (user) => onChange(toAdminUser(user)))
    },
  }
}
