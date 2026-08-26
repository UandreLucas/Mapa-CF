import { z } from 'zod'

const phoneRegex = /^[\d\s()+-]{8,20}$/

export const contactSchema = z.object({
  name: z.string().min(3, 'Informe seu nome completo'),
  email: z.string().email('E-mail inválido').or(z.literal('')).optional(),
  phone: z
    .string()
    .regex(phoneRegex, 'Telefone inválido')
    .min(8, 'Telefone inválido'),
  message: z.string().min(5, 'Escreva uma mensagem'),
  type: z
    .enum([
      'contact',
      'property_interest',
      'list_property',
      'evaluate',
      'schedule',
      'newsletter',
      'development_interest',
    ])
    .default('contact'),
  property_id: z.string().uuid().nullable().optional(),
  development_id: z.string().uuid().nullable().optional(),
  best_time: z.string().optional(),
  source: z.string().optional(),
  privacy_consent: z.literal(true, {
    errorMap: () => ({ message: 'Você precisa aceitar a política de privacidade' }),
  }),
})

export type ContactFormValues = z.infer<typeof contactSchema>

export const listPropertySchema = z.object({
  name: z.string().min(3, 'Informe seu nome completo'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().regex(phoneRegex, 'Telefone inválido').min(8, 'Telefone inválido'),
  message: z.string().min(10, 'Descreva o seu imóvel'),
  type: z.literal('list_property').default('list_property'),
  privacy_consent: z.literal(true, {
    errorMap: () => ({ message: 'Você precisa aceitar a política de privacidade' }),
  }),
})

export type ListPropertyFormValues = z.infer<typeof listPropertySchema>

export const evaluateSchema = z.object({
  name: z.string().min(3, 'Informe seu nome completo'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().regex(phoneRegex, 'Telefone inválido').min(8, 'Telefone inválido'),
  message: z.string().min(10, 'Conte-nos sobre o imóvel a ser avaliado'),
  type: z.literal('evaluate').default('evaluate'),
  privacy_consent: z.literal(true, {
    errorMap: () => ({ message: 'Você precisa aceitar a política de privacidade' }),
  }),
})

export type EvaluateFormValues = z.infer<typeof evaluateSchema>

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter ao menos 6 caracteres'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const leadNoteSchema = z.object({
  content: z.string().min(1, 'Escreva uma anotação'),
})

export const settingsSchema = z.record(z.string(), z.string())
