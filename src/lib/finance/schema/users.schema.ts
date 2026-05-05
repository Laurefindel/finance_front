import { z } from 'zod'
import { RoleSchema } from './roles.schema'

function isValidEmail(value: string) {
  if (value.length > 254) {
    return false
  }

  let atIndex = -1
  for (let i = 0; i < value.length; i += 1) {
    const char = value[i]
    if (char === ' ') {
      return false
    }

    if (char === '@') {
      if (atIndex !== -1) {
        return false
      }

      atIndex = i
    }
  }

  if (atIndex <= 0 || atIndex >= value.length - 1) {
    return false
  }

  const domain = value.slice(atIndex + 1)
  if (!domain.includes('.')) {
    return false
  }

  const labels = domain.split('.')
  return labels.every((label) => label.length > 0)
}

export const UserRequestSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z
    .string()
    .trim()
    .superRefine((value, ctx) => {
      if (!isValidEmail(value)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Некорректный email',
        })
      }
    }),
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
  roles: z.array(RoleSchema).optional().default([]),
})

export type UserRequest = z.infer<typeof UserRequestSchema>
export type UserResponse = z.infer<typeof UserResponseSchema>
