import { z } from 'zod'
import { CurrencyResponseSchema } from './currencies.schema'
import {
  FinancialOperationResponseSchema,
} from './operations.schema'
import {
  positiveIntSchema,
} from './shared.schema'
import { UserResponseSchema } from './users.schema'

export const AccountRequestSchema = z.object({
  userId: positiveIntSchema,
  currencyId: positiveIntSchema,
})

const accountOperationsSchema = z
  .array(FinancialOperationResponseSchema)
  .nullish()
  .transform((value) => value ?? [])

export const AccountResponseSchema = z.object({
  id: z.number().int().optional(),
  balance: z.number().optional(),
  user: UserResponseSchema.optional(),
  currency: CurrencyResponseSchema.optional(),
  outcomingOperations: accountOperationsSchema,
  incomingOperations: accountOperationsSchema,
})

export type AccountRequest = z.infer<typeof AccountRequestSchema>
export type AccountResponse = z.infer<typeof AccountResponseSchema>
