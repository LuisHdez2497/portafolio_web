import { describe, expect, it } from 'vitest'
import { profileFormSchema, type ProfileFormInput } from './dto'

const validInput: ProfileFormInput = {
  name: 'Luis',
  location: 'Mexico',
  summary: { es: 'Ingeniero de software', en: '' },
  contact: {
    email: 'luis@example.com',
    phone: '',
    website: '',
    linkedin: '',
    github: '',
    preferredChannel: 'whatsapp',
  },
}

describe('profileFormSchema', () => {
  it('acepta un perfil válido con inglés opcional', () => {
    expect(profileFormSchema.safeParse(validInput).success).toBe(true)
  })

  it('rechaza un nombre vacío', () => {
    expect(profileFormSchema.safeParse({ ...validInput, name: '' }).success).toBe(false)
  })

  it('rechaza un resumen sin español', () => {
    expect(profileFormSchema.safeParse({ ...validInput, summary: { es: '', en: 'x' } }).success).toBe(false)
  })

  it('rechaza un correo de contacto inválido', () => {
    const input = { ...validInput, contact: { ...validInput.contact, email: 'no-es-email' } }
    expect(profileFormSchema.safeParse(input).success).toBe(false)
  })

  it('rechaza una URL de contacto con esquema javascript:', () => {
    const input = { ...validInput, contact: { ...validInput.contact, website: 'javascript:alert(1)' } }
    expect(profileFormSchema.safeParse(input).success).toBe(false)
  })

  it('acepta URLs http(s) o vacías en los enlaces de contacto', () => {
    const input = {
      ...validInput,
      contact: { ...validInput.contact, website: 'https://site.com', linkedin: '', github: 'http://gh.com' },
    }
    expect(profileFormSchema.safeParse(input).success).toBe(true)
  })
})
