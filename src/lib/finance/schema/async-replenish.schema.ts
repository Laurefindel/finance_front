import { z } from 'zod'

export const AsyncTaskSubmissionSchema = z.object({
  taskId: z.string(),
})

export const AsyncTaskStatusSchema = z.object({
  taskId: z.string().optional(),
  status: z.string().optional(),
  message: z.string().optional(),
})

export const AsyncTaskMetricsSchema = z.object({
  submitted: z.number().int().optional(),
  running: z.number().int().optional(),
  succeeded: z.number().int().optional(),
  failed: z.number().int().optional(),
})

export type AsyncTaskSubmission = z.infer<typeof AsyncTaskSubmissionSchema>
export type AsyncTaskStatus = z.infer<typeof AsyncTaskStatusSchema>
export type AsyncTaskMetrics = z.infer<typeof AsyncTaskMetricsSchema>
