import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { financeRequest } from '../finance.server'
import {
  AccountRequestSchema,
  AccountResponseSchema,
  type AccountResponse,
} from '../schemas'

const idSchema = z.object({
  id: z.number().int().positive(),
})

const listAccountsInputSchema = z.object({
  userId: z.number().int().positive().optional(),
  currency: z.string().trim().max(3).optional(),
})

const replenishInputSchema = z.object({
  id: z.number().int().positive(),
  amount: z.number().min(0),
})

export const listAccountsFn = createServerFn({ method: 'GET' })
  .inputValidator(listAccountsInputSchema)
  .handler(async ({ data }): Promise<AccountResponse[]> => {
    return financeRequest({
      path: '/accounts',
      method: 'GET',
      query: {
        userId: data.userId,
        currency: data.currency,
      },
      schema: z.array(AccountResponseSchema),
    })
  })

export const createAccountFn = createServerFn({ method: 'POST' })
  .inputValidator(AccountRequestSchema)
  .handler(async ({ data }): Promise<AccountResponse> => {
    return financeRequest({
      path: '/accounts',
      method: 'POST',
      body: data,
      schema: AccountResponseSchema,
    })
  })

export const replenishAccountFn = createServerFn({ method: 'POST' })
  .inputValidator(replenishInputSchema)
  .handler(async ({ data }): Promise<AccountResponse> => {
    return financeRequest({
      path: `/accounts/${data.id}/replenish/${data.amount}`,
      method: 'PATCH',
      schema: AccountResponseSchema,
    })
  })

export const deleteAccountFn = createServerFn({ method: 'POST' })
  .inputValidator(idSchema)
  .handler(async ({ data }): Promise<{ success: true }> => {
    await financeRequest({
      path: `/accounts/${data.id}`,
      method: 'DELETE',
    })

    return { success: true }
  })
