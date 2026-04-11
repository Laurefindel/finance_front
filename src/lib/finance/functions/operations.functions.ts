import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { financeRequest } from '../finance.server'
import {
  FinancialOperationRequestSchema,
  FinancialOperationResponseSchema,
  FinancialOperationSearchCriteriaSchema,
  PageFinancialOperationResponseSchema,
  type FinancialOperationResponse,
  type PageFinancialOperationResponse,
} from '../schemas'

const idSchema = z.object({
  id: z.number().int().positive(),
})

const listOperationsInputSchema = z.object({
  senderUserId: z.number().int().positive().optional(),
})

const searchOperationsInputSchema = z.object({
  queryType: z.enum(['jpql', 'criteria']).default('jpql'),
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).max(100).default(10),
  sort: z.array(z.string()).optional(),
  criteria: FinancialOperationSearchCriteriaSchema.default({}),
})

export const listOperationsFn = createServerFn({ method: 'GET' })
  .inputValidator(listOperationsInputSchema)
  .handler(async ({ data }): Promise<FinancialOperationResponse[]> => {
    return financeRequest({
      path: '/operations',
      method: 'GET',
      query: {
        senderUserId: data.senderUserId,
      },
      schema: z.array(FinancialOperationResponseSchema),
    })
  })

export const createOperationFn = createServerFn({ method: 'POST' })
  .inputValidator(FinancialOperationRequestSchema)
  .handler(async ({ data }): Promise<FinancialOperationResponse> => {
    return financeRequest({
      path: '/operations',
      method: 'POST',
      body: data,
      schema: FinancialOperationResponseSchema,
    })
  })

export const deleteOperationFn = createServerFn({ method: 'POST' })
  .inputValidator(idSchema)
  .handler(async ({ data }): Promise<{ success: true }> => {
    await financeRequest({
      path: `/operations/${data.id}`,
      method: 'DELETE',
    })

    return { success: true }
  })

export const searchOperationsFn = createServerFn({ method: 'POST' })
  .inputValidator(searchOperationsInputSchema)
  .handler(async ({ data }): Promise<PageFinancialOperationResponse> => {
    return financeRequest({
      path: '/operations/search',
      method: 'POST',
      query: {
        queryType: data.queryType,
        page: data.page,
        size: data.size,
        sort: data.sort,
      },
      body: data.criteria,
      schema: PageFinancialOperationResponseSchema,
    })
  })

export const createBulkOperationsFn = createServerFn({ method: 'POST' })
  .inputValidator(z.array(FinancialOperationRequestSchema))
  .handler(async ({ data }): Promise<FinancialOperationResponse[]> => {
    return financeRequest({
      path: '/operations/bulk',
      method: 'POST',
      body: data,
      schema: z.array(FinancialOperationResponseSchema),
    })
  })

export const createBulkOperationsNoTxFn = createServerFn({ method: 'POST' })
  .inputValidator(z.array(FinancialOperationRequestSchema))
  .handler(async ({ data }): Promise<FinancialOperationResponse[]> => {
    return financeRequest({
      path: '/operations/bulk/non-transactional',
      method: 'POST',
      body: data,
      schema: z.array(FinancialOperationResponseSchema),
    })
  })
