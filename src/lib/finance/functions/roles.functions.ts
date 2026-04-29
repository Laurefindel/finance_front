import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { financeRequest } from '../finance.server'
import { RoleSchema, type Role } from '../schemas'

const idSchema = z.object({
  id: z.number().int().positive(),
})

const nameSchema = z.object({
  name: z.string().trim().min(1),
})

export const listRolesFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Role[]> => {
    return financeRequest({
      path: '/roles',
      method: 'GET',
      schema: z.array(RoleSchema),
    })
  },
)

export const createRoleFn = createServerFn({ method: 'POST' })
  .inputValidator(RoleSchema.pick({ name: true }))
  .handler(async ({ data }): Promise<Role> => {
    return financeRequest({
      path: '/roles',
      method: 'POST',
      body: data,
      schema: RoleSchema,
    })
  })

export const getRoleByNameFn = createServerFn({ method: 'GET' })
  .inputValidator(nameSchema)
  .handler(async ({ data }): Promise<Role> => {
    return financeRequest({
      path: '/roles/by-name',
      method: 'GET',
      query: {
        name: data.name,
      },
      schema: RoleSchema,
    })
  })

export const deleteRoleFn = createServerFn({ method: 'POST' })
  .inputValidator(idSchema)
  .handler(async ({ data }): Promise<{ success: true }> => {
    await financeRequest({
      path: `/roles/${data.id}`,
      method: 'DELETE',
    })

    return { success: true }
  })
