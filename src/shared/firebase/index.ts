import { getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { initializeFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'
import { getEnv } from '@/shared/config/env'

function resolveApp(): FirebaseApp {
  const existing = getApps()
  if (existing.length > 0) {
    return existing[0]
  }

  const env = getEnv()
  return initializeApp({
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
  })
}

export const app = resolveApp()

export const db: Firestore = initializeFirestore(app, { experimentalForceLongPolling: true })
export const auth: Auth = getAuth(app)
export const storage: FirebaseStorage = getStorage(app)
