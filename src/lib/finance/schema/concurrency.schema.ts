import { z } from 'zod'

export const RaceConditionDemoSchema = z.object({
  threads: z.number().int().optional(),
  incrementsPerThread: z.number().int().optional(),
  expected: z.number().int().optional(),
  unsafeCounter: z.number().int().optional(),
  synchronizedCounter: z.number().int().optional(),
  atomicCounter: z.number().int().optional(),
  raceConditionDetected: z.boolean().optional(),
})

export type RaceConditionDemo = z.infer<typeof RaceConditionDemoSchema>
