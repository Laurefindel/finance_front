import { z } from 'zod'

export const CurrencyRequestSchema = z.object({
  code: z.string().trim().length(3),
  name: z.string().trim().min(1).max(100),
})

export const CurrencyResponseSchema = z.object({
  id: z.number().int().optional(),
  code: z.string().trim(),
  name: z.string().trim(),
})

export type CurrencyRequest = z.infer<typeof CurrencyRequestSchema>
export type CurrencyResponse = z.infer<typeof CurrencyResponseSchema>
