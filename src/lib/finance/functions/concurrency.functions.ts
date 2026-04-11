import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { financeRequest } from '../finance.server'
import {
  RaceConditionDemoSchema,
  type RaceConditionDemo,
} from '../schemas'

const raceDemoInputSchema = z.object({
  threads: z.number().int().min(50).default(64),
  incrementsPerThread: z.number().int().min(1).default(10000),
})

export const runRaceDemoFn = createServerFn({ method: 'POST' })
  .inputValidator(raceDemoInputSchema)
  .handler(async ({ data }): Promise<RaceConditionDemo> => {
    return financeRequest({
      path: '/concurrency/race-demo',
      method: 'GET',
      query: {
        threads: data.threads,
        incrementsPerThread: data.incrementsPerThread,
      },
      schema: RaceConditionDemoSchema,
    })
  })
