import { z } from 'zod'

export const positiveIntSchema = z.number().int().positive()
export const nonNegativeNumberSchema = z.number().min(0)
