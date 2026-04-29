import { z } from 'zod'

export const UserRequestSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z
    .string()
    .trim()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Некорректный email'),
  password: z.string().min(1),
})

export const UserResponseSchema = z.object({
  id: z.number().int().optional(),
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
  email: z.string().trim().optional(),
  status: z.string().trim().optional(),
  accountsIds: z.array(z.number().int()).optional().default([]),
  roleIds: z.array(z.number().int()).optional().default([]),
})

export type UserRequest = z.infer<typeof UserRequestSchema>
export type UserResponse = z.infer<typeof UserResponseSchema>
