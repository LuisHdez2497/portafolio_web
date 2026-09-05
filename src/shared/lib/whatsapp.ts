export function toWhatsAppUrl(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return digits ? `https://wa.me/${digits}` : ''
}
