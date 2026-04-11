import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { financeRequest } from '../finance.server'
import {
  AsyncTaskMetricsSchema,
  AsyncTaskStatusSchema,
  AsyncTaskSubmissionSchema,
  type AsyncTaskMetrics,
  type AsyncTaskStatus,
  type AsyncTaskSubmission,
} from '../schemas'

const asyncReplenishInputSchema = z.object({
  accountId: z.number().int().positive(),
  amount: z.number().min(0),
})

const asyncStatusInputSchema = z.object({
  taskId: z.string().trim().min(1),
})

export const startAsyncReplenishFn = createServerFn({ method: 'POST' })
  .inputValidator(asyncReplenishInputSchema)
  .handler(async ({ data }): Promise<AsyncTaskSubmission> => {
    return financeRequest({
      path: '/async/replenish',
      method: 'POST',
      query: {
        accountId: data.accountId,
        amount: data.amount,
      },
      schema: AsyncTaskSubmissionSchema,
    })
  })

export const getAsyncStatusFn = createServerFn({ method: 'GET' })
  .inputValidator(asyncStatusInputSchema)
  .handler(async ({ data }): Promise<AsyncTaskStatus> => {
    return financeRequest({
      path: `/async/replenish/${data.taskId}`,
      method: 'GET',
      schema: AsyncTaskStatusSchema,
    })
  })

export const getAsyncMetricsFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<AsyncTaskMetrics> => {
    return financeRequest({
      path: '/async/replenish/metrics',
      method: 'GET',
      schema: AsyncTaskMetricsSchema,
    })
  },
)
