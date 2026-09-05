import { getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { initializeFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'
import { getEnv } from '@/shared/config/env'

let app: FirebaseApp | null = null
let firestore: Firestore | null = null
let authentication: Auth | null = null
let fileStorage: FirebaseStorage | null = null

export function getFirebaseApp(): FirebaseApp {
  if (app) return app
  const existing = getApps()
  if (existing.length > 0) {
    app = existing[0]
    return app
  }
  const env = getEnv()
  app = initializeApp({
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
  })
  return app
}

export function getDb(): Firestore {
  firestore ??= initializeFirestore(getFirebaseApp(), { experimentalForceLongPolling: true })
  return firestore
}

export function getFirebaseAuth(): Auth {
  authentication ??= getAuth(getFirebaseApp())
  return authentication
}

export function getFirebaseStorage(): FirebaseStorage {
  fileStorage ??= getStorage(getFirebaseApp())
  return fileStorage
}
