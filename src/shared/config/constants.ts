export const ROUTES = {
  home: '/',
  admin: '/admin',
  portfolioPreview: '/?ver=1',
} as const

export const COLLECTIONS = {
  profile: 'profile',
  skills: 'skills',
  experience: 'experience',
  education: 'education',
  languages: 'languages',
  certifications: 'certifications',
  projects: 'projects',
  errorLogs: 'errorLogs',
  visits: 'visits',
  pushTokens: 'pushTokens',
  config: 'config',
} as const

export const PROFILE_DOC = 'main'
export const NOTIFICATION_PREFS_DOC = 'notifications'

export const HEADSHOT_URL = '/software-developer-headshot.JPEG'

export const CV_FILE_NAMES = {
  es: 'CV_LuisAlfonsoHernandez_ES.pdf',
  en: 'CV_LuisAlfonsoHernandez_EN.pdf',
} as const

export const TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2'
export const TRANSLATE_SOURCE_LANG = 'es'
export const TRANSLATE_TARGET_LANG = 'en'
