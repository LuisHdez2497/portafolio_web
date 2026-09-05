import type { Locale } from '../domain/ui-labels'

const DATE_TERMS_ES_TO_EN: Record<string, string> = {
  Enero: 'January',
  Febrero: 'February',
  Marzo: 'March',
  Abril: 'April',
  Mayo: 'May',
  Junio: 'June',
  Julio: 'July',
  Agosto: 'August',
  Septiembre: 'September',
  Octubre: 'October',
  Noviembre: 'November',
  Diciembre: 'December',
  Presente: 'Present',
  Actualidad: 'Present',
  Actual: 'Present',
}

export function localizeDateRange(dateRange: string, locale: Locale): string {
  if (locale === 'es') return dateRange
  return dateRange.replace(/[A-Za-zÁÉÍÓÚáéíóú]+/g, (word) => DATE_TERMS_ES_TO_EN[word] ?? word)
}

const LOCATION_ES_TO_EN: Record<string, string> = {
  Remoto: 'Remote',
  Híbrido: 'Hybrid',
  Presencial: 'On-site',
  Canadá: 'Canada',
}

export function localizeLocation(location: string, locale: Locale): string {
  if (locale === 'es') return location
  return location.replace(/[A-Za-zÁÉÍÓÚáéíóúÑñ]+/g, (word) => LOCATION_ES_TO_EN[word] ?? word)
}
