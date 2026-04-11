import { z } from 'zod'

export type FinanceHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type QueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<string | number | boolean>

export interface FinanceRequestBaseOptions {
  path: string
  method?: FinanceHttpMethod
  query?: Record<string, QueryValue>
  body?: unknown
}

export interface FinanceRequestWithSchemaOptions<T>
  extends FinanceRequestBaseOptions {
  schema: z.ZodType<T>
}

export type FinanceRequestOptions<T> =
  | FinanceRequestBaseOptions
  | FinanceRequestWithSchemaOptions<T>
