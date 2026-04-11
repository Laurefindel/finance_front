import { z } from 'zod'

export const ApiValidationErrorsSchema = z.record(z.string(), z.string())

export const ApiProblemSchema = z.object({
  timestamp: z.string().optional(),
  status: z.number().int().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
  path: z.string().optional(),
  validationErrors: ApiValidationErrorsSchema.nullish(),
})

export type ApiProblem = z.infer<typeof ApiProblemSchema>
