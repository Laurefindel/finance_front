import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { financeRequest } from '../finance.server'
import {
  CurrencyRequestSchema,
  CurrencyResponseSchema,
  type CurrencyResponse,
} from '../schemas'

const idSchema = z.object({
  id: z.number().int().positive(),
})

const currencyCodeSchema = z.object({
  code: z.string().trim().length(3),
})

const currencyNameSchema = z.object({
  name: z.string().trim().min(1),
})

const updateCurrencyInputSchema = z.object({
  id: z.number().int().positive(),
  payload: CurrencyRequestSchema,
})

export const listCurrenciesFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<CurrencyResponse[]> => {
    return financeRequest({
      path: '/currencies',
      method: 'GET',
      schema: z.array(CurrencyResponseSchema),
    })
  },
)

export const createCurrencyFn = createServerFn({ method: 'POST' })
  .inputValidator(CurrencyRequestSchema)
  .handler(async ({ data }): Promise<CurrencyResponse> => {
    return financeRequest({
      path: '/currencies',
      method: 'POST',
      body: data,
      schema: CurrencyResponseSchema,
    })
  })

export const updateCurrencyFn = createServerFn({ method: 'POST' })
  .inputValidator(updateCurrencyInputSchema)
  .handler(async ({ data }): Promise<CurrencyResponse> => {
    return financeRequest({
      path: `/currencies/${data.id}`,
      method: 'PATCH',
      body: data.payload,
      schema: CurrencyResponseSchema,
    })
  })

export const getCurrencyByCodeFn = createServerFn({ method: 'GET' })
  .inputValidator(currencyCodeSchema)
  .handler(async ({ data }): Promise<CurrencyResponse> => {
    return financeRequest({
      path: '/currencies/by-code',
      method: 'GET',
      query: {
        code: data.code,
      },
      schema: CurrencyResponseSchema,
    })
  })

export const listCurrenciesByNameFn = createServerFn({ method: 'GET' })
  .inputValidator(currencyNameSchema)
  .handler(async ({ data }): Promise<CurrencyResponse[]> => {
    return financeRequest({
      path: '/currencies/by-name',
      method: 'GET',
      query: {
        name: data.name,
      },
      schema: z.array(CurrencyResponseSchema),
    })
  })

export const deleteCurrencyFn = createServerFn({ method: 'POST' })
  .inputValidator(idSchema)
  .handler(async ({ data }): Promise<{ success: true }> => {
    await financeRequest({
      path: `/currencies/${data.id}`,
      method: 'DELETE',
    })

    return { success: true }
  })
