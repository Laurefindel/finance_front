import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { financeRequest } from '../finance.server'
import {
  UserRequestSchema,
  UserResponseSchema,
  type UserResponse,
} from '../schemas'

const idSchema = z.object({
  id: z.number().int().positive(),
})

const updateUserInputSchema = z.object({
  id: z.number().int().positive(),
  payload: UserRequestSchema,
})

export const listUsersFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<UserResponse[]> => {
    return financeRequest({
      path: '/users/all',
      method: 'GET',
      schema: z.array(UserResponseSchema),
    })
  },
)

export const createUserFn = createServerFn({ method: 'POST' })
  .inputValidator(UserRequestSchema)
  .handler(async ({ data }): Promise<UserResponse> => {
    return financeRequest({
      path: '/users/register',
      method: 'POST',
      body: data,
      schema: UserResponseSchema,
    })
  })

export const updateUserFn = createServerFn({ method: 'POST' })
  .inputValidator(updateUserInputSchema)
  .handler(async ({ data }): Promise<UserResponse> => {
    return financeRequest({
      path: `/users/${data.id}/change-user-information`,
      method: 'PATCH',
      body: data.payload,
      schema: UserResponseSchema,
    })
  })

export const deleteUserFn = createServerFn({ method: 'POST' })
  .inputValidator(idSchema)
  .handler(async ({ data }): Promise<{ success: true }> => {
    await financeRequest({
      path: `/users/${data.id}`,
      method: 'DELETE',
    })

    return { success: true }
  })
