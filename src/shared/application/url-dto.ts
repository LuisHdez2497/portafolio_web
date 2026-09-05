import { z } from 'zod'

const HTTP_URL = /^https?:\/\/[^\s.]+\.[^\s]+$/i

export function requiredUrl(message: string) {
  return z
    .string()
    .trim()
    .refine((value) => HTTP_URL.test(value), message)
}

export function optionalUrl(message: string) {
  return z
    .string()
    .trim()
    .refine((value) => value === '' || HTTP_URL.test(value), message)
}
