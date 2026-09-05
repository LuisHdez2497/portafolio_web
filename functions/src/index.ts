import { logger, setGlobalOptions } from 'firebase-functions/v2'
import { onRequest } from 'firebase-functions/v2/https'
import * as admin from 'firebase-admin'
import { UAParser } from 'ua-parser-js'
import type { VisitEventInput, VisitEventType, VisitGeo } from '@shared/visit'

admin.initializeApp()
admin.firestore().settings({ ignoreUndefinedProperties: true })
setGlobalOptions({ region: 'us-central1', maxInstances: 5 })

const ADMIN_LINK = 'https://portfolio-luisalfonsohernandez.web.app/admin?view=visits'

const EVENT_LABEL: Record<VisitEventType, string> = {
  cv_download: 'descargó tu CV',
  github_click: 'visitó tu GitHub',
  linkedin_click: 'visitó tu LinkedIn',
  project_link: 'abrió un proyecto',
  contact_click: 'tocó un contacto',
}

const EVENT_EMOJI: Record<VisitEventType, string> = {
  cv_download: '📄',
  github_click: '🐙',
  linkedin_click: '💼',
  project_link: '🚀',
  contact_click: '✉️',
}

function isValidEvent(body: unknown): body is VisitEventInput {
  const type = (body as { type?: unknown } | null)?.type
  return typeof type === 'string' && type in EVENT_LABEL
}

async function lookupGeo(ip: string): Promise<VisitGeo> {
  try {
    const response = await fetch(`https://ipwho.is/${ip}?fields=success,city,region,country,latitude,longitude`)
    const data = (await response.json()) as {
      success?: boolean
      city?: string
      region?: string
      country?: string
      latitude?: number
      longitude?: number
    }
    if (!data.success) return {}
    return { city: data.city, region: data.region, country: data.country, lat: data.latitude, lng: data.longitude }
  } catch (error) {
    logger.warn('geo lookup failed', error)
    return {}
  }
}

async function sendPush(title: string, body: string): Promise<void> {
  const snapshot = await admin.firestore().collection('pushTokens').get()
  const tokens = snapshot.docs.map((doc) => doc.get('token') as string).filter(Boolean)
  if (tokens.length === 0) return

  const response = await admin.messaging().sendEachForMulticast({
    tokens,
    notification: { title, body },
    webpush: { fcmOptions: { link: ADMIN_LINK } },
  })

  const stale = response.responses
    .map((result, index) => (result.success ? null : snapshot.docs[index]))
    .filter((doc): doc is (typeof snapshot.docs)[number] => doc !== null)
  await Promise.all(stale.map((doc) => doc.ref.delete()))
}

async function isPushEnabled(type: VisitEventType): Promise<boolean> {
  const prefs = (await admin.firestore().collection('config').doc('notifications').get()).data()
  return prefs ? prefs[type] !== false : true
}

const ALLOWED_ORIGINS = [
  'https://luisalfonsohernandezn.site',
  'https://portfolio-luisalfonsohernandez.web.app',
  'https://portfolio-luisalfonsohernandez.firebaseapp.com',
]
const RATE_LIMIT = 30
const RATE_WINDOW_MS = 60 * 60 * 1000

function isAllowedOrigin(origin: string | undefined, referer: string | undefined): boolean {
  if (origin) return ALLOWED_ORIGINS.includes(origin)
  if (referer) return ALLOWED_ORIGINS.some((allowed) => referer.startsWith(allowed))
  return false
}

async function isRateLimited(ip: string): Promise<boolean> {
  if (!ip) return false
  const ref = admin.firestore().collection('rateLimits').doc(ip.replace(/[^\w.:-]/g, '_'))
  const now = Date.now()
  return admin.firestore().runTransaction(async (tx) => {
    const data = (await tx.get(ref)).data()
    if (!data || now - (data.windowStart as number) > RATE_WINDOW_MS) {
      tx.set(ref, { windowStart: now, count: 1 })
      return false
    }
    if ((data.count as number) >= RATE_LIMIT) return true
    tx.update(ref, { count: (data.count as number) + 1 })
    return false
  })
}

export const recordVisit = onRequest({ cors: true, invoker: 'public' }, async (request, response) => {
  if (request.method === 'OPTIONS') {
    response.status(204).send('')
    return
  }
  if (request.method !== 'POST' || !isValidEvent(request.body)) {
    response.status(400).send('Invalid request')
    return
  }
  if (!isAllowedOrigin(request.headers.origin, request.headers.referer)) {
    response.status(403).send('Forbidden')
    return
  }

  const forwarded = (request.headers['x-forwarded-for'] as string | undefined) ?? ''
  const ip = forwarded.split(',')[0]?.trim() || request.ip || ''
  if (await isRateLimited(ip)) {
    response.status(429).send('Too many requests')
    return
  }

  const event = request.body
  const parsed = new UAParser(event.userAgent || (request.headers['user-agent'] as string) || '').getResult()
  const geo = ip ? await lookupGeo(ip) : {}

  const device = {
    browser: parsed.browser.name ?? '',
    os: parsed.os.name ?? '',
    deviceType: parsed.device.type ?? 'computadora',
    brand: parsed.device.vendor ?? '',
  }

  await admin.firestore().collection('visits').add({
    type: event.type,
    detail: event.detail ?? '',
    locale: event.locale ?? '',
    language: event.language ?? '',
    referrer: event.referrer ?? '',
    screen: event.screen ?? '',
    timezone: event.timezone ?? '',
    geo,
    device,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  })

  const place = [geo.city, geo.country].filter(Boolean).join(', ') || 'Alguien'
  const deviceLine = [device.brand, device.os, device.browser].filter(Boolean).join(' · ')
  const title = `${EVENT_EMOJI[event.type]} ${place} ${EVENT_LABEL[event.type]}`
  const body = event.detail ? `“${event.detail}” · ${deviceLine}` : deviceLine || 'Nueva visita'

  if (await isPushEnabled(event.type)) {
    try {
      await sendPush(title, body)
    } catch (error) {
      logger.error('push notification failed', error)
    }
  }

  response.status(204).send('')
})
