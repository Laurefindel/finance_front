import { z } from 'zod'

export const RoleSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().trim().min(1).max(50),
})

export type Role = z.infer<typeof RoleSchema>
