import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { getMessaging, getToken, isSupported, type Messaging } from 'firebase/messaging'
import { COLLECTIONS } from '@/shared/config/constants'
import { getEnv } from '@/shared/config/env'
import { getDb, getFirebaseApp } from '@/shared/firebase'

export type PushStatus = 'granted' | 'blocked' | 'unsupported' | 'default' | 'error'

const SW_URL = '/firebase-messaging-sw.js'
const SW_SCOPE = '/firebase-cloud-messaging-push-scope'
const CLIENT_ID_KEY = 'portfolio-push-client-id'
const TOKEN_TIMEOUT_MS = 12000

let messagingPromise: Promise<Messaging | null> | null = null

function vapidKey(): string | undefined {
  return getEnv().VITE_FIREBASE_VAPID_KEY
}

function isPushCapable(): boolean {
  return 'Notification' in globalThis && 'serviceWorker' in navigator && 'PushManager' in globalThis
}

async function resolveMessaging(): Promise<Messaging | null> {
  return isPushCapable() && (await isSupported()) ? getMessaging(getFirebaseApp()) : null
}

function getMessagingInstance(): Promise<Messaging | null> {
  messagingPromise ??= resolveMessaging()
  return messagingPromise
}

function clientId(): string {
  const existing = localStorage.getItem(CLIENT_ID_KEY)
  if (existing) return existing
  const id = crypto.randomUUID()
  localStorage.setItem(CLIENT_ID_KEY, id)
  return id
}

function serviceWorkerUrl(): string {
  const env = getEnv()
  const params = new URLSearchParams({
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  })
  return `${SW_URL}?${params.toString()}`
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([promise, new Promise<null>((resolve) => setTimeout(() => resolve(null), ms))])
}

async function fetchToken(messaging: Messaging): Promise<string | null> {
  const key = vapidKey()
  if (!key) return null
  const registration = await navigator.serviceWorker.register(serviceWorkerUrl(), { scope: SW_SCOPE })
  const token = await getToken(messaging, { vapidKey: key, serviceWorkerRegistration: registration })
  return token || null
}

async function storeToken(token: string): Promise<void> {
  await setDoc(doc(getDb(), COLLECTIONS.pushTokens, clientId()), {
    token,
    userAgent: navigator.userAgent,
    updatedAt: serverTimestamp(),
  })
}

export function isPushConfigured(): boolean {
  return Boolean(vapidKey())
}

export function currentPushStatus(): PushStatus {
  if (!isPushConfigured() || !('Notification' in globalThis)) return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied') return 'blocked'
  return 'default'
}

export async function enablePush(): Promise<PushStatus> {
  if (!isPushConfigured() || !isPushCapable()) return 'unsupported'
  if (Notification.permission === 'denied') return 'blocked'

  const permission = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission()
  if (permission !== 'granted') return permission === 'denied' ? 'blocked' : 'default'

  const messaging = await getMessagingInstance()
  if (!messaging) return 'unsupported'

  const token = await withTimeout(fetchToken(messaging), TOKEN_TIMEOUT_MS).catch(() => null)
  if (!token) return 'error'

  await storeToken(token).catch(() => undefined)
  return 'granted'
}

export async function refreshPushToken(): Promise<void> {
  if (currentPushStatus() !== 'granted') return
  const messaging = await getMessagingInstance()
  if (!messaging) return
  const token = await withTimeout(fetchToken(messaging), TOKEN_TIMEOUT_MS).catch(() => null)
  if (token) await storeToken(token).catch(() => undefined)
}

export async function prewarmPush(): Promise<void> {
  if (!isPushConfigured() || !isPushCapable()) return
  await navigator.serviceWorker.register(serviceWorkerUrl(), { scope: SW_SCOPE }).catch(() => undefined)
}
