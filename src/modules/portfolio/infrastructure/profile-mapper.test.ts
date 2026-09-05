import { describe, expect, it } from 'vitest'
import { toProfile, toProfileDocument } from './profile-mapper'

describe('toProfile', () => {
  it('mapea el documento con el resumen bilingüe embebido', () => {
    const profile = toProfile({
      name: 'Luis Alfonso Hernández',
      location: 'Guadalajara, Jalisco',
      summary: { es: 'resumen', en: 'summary' },
      contact: { email: 'a@b.com', phone: '667', website: 'https://site', linkedin: 'https://ln', github: 'https://gh' },
    })

    expect(profile).toMatchObject({
      name: 'Luis Alfonso Hernández',
      location: 'Guadalajara, Jalisco',
      summary: { es: 'resumen', en: 'summary' },
      contact: { email: 'a@b.com', phone: '667', website: 'https://site', linkedin: 'https://ln', github: 'https://gh' },
    })
  })

  it('usa valores por defecto cuando faltan campos', () => {
    const profile = toProfile({})
    expect(profile.name).toBe('')
    expect(profile.summary).toEqual({ es: '', en: '' })
    expect(profile.contact.email).toBe('')
    expect(profile.updatedAt).toBeUndefined()
  })

  it('conserva el canal de contacto preferido cuando es conocido', () => {
    const profile = toProfile({ contact: { preferredChannel: 'email' } })
    expect(profile.contact.preferredChannel).toBe('email')
  })

  it('cae en WhatsApp cuando el canal falta o no se reconoce', () => {
    expect(toProfile({}).contact.preferredChannel).toBe('whatsapp')
    expect(toProfile({ contact: {} }).contact.preferredChannel).toBe('whatsapp')
    expect(toProfile({ contact: { preferredChannel: 'paloma-mensajera' } }).contact.preferredChannel).toBe('whatsapp')
  })
})

describe('toProfileDocument', () => {
  it('escribe solo los campos provistos con nombres en inglés', () => {
    const document = toProfileDocument({
      name: 'Luis',
      summary: { es: 'r', en: 's' },
    })
    expect(document).toEqual({ name: 'Luis', summary: { es: 'r', en: 's' } })
    expect(document).not.toHaveProperty('location')
  })
})
