import { z } from 'zod'
import {
  nonNegativeNumberSchema,
  positiveIntSchema,
} from './shared.schema'

export const FinancialOperationRequestSchema = z.object({
  senderAccountId: positiveIntSchema,
  receiverAccountId: positiveIntSchema,
  amount: nonNegativeNumberSchema,
  description: z.string().max(255).optional(),
})

export const FinancialOperationResponseSchema = z.object({
  id: z.number().int().optional(),
  senderAccountId: z.number().int().optional(),
  receiverAccountId: z.number().int().optional(),
  description: z
    .string()
    .nullish()
    .transform((value) => value ?? undefined),
  amount: z.number().optional(),
  currencyCode: z.string().optional(),
})

export const FinancialOperationSearchCriteriaSchema = z.object({
  senderUserId: positiveIntSchema.optional(),
  receiverUserId: positiveIntSchema.optional(),
  currencyCode: z.string().trim().max(3).optional(),
  minAmount: nonNegativeNumberSchema.optional(),
  maxAmount: nonNegativeNumberSchema.optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
})

export const PageableSchema = z.object({
  page: z.number().int().min(0).optional(),
  size: z.number().int().min(1).optional(),
  sort: z.array(z.string()).optional(),
})

export const SortObjectSchema = z.object({
  sorted: z.boolean().optional(),
  empty: z.boolean().optional(),
  unsorted: z.boolean().optional(),
})

export const PageableObjectSchema = z.object({
  paged: z.boolean().optional(),
  pageNumber: z.number().int().optional(),
  pageSize: z.number().int().optional(),
  offset: z.number().int().optional(),
  sort: SortObjectSchema.optional(),
  unpaged: z.boolean().optional(),
})

export const PageFinancialOperationResponseSchema = z.object({
  totalElements: z.number().int().optional(),
  totalPages: z.number().int().optional(),
  pageable: PageableObjectSchema.optional(),
  first: z.boolean().optional(),
  last: z.boolean().optional(),
  size: z.number().int().optional(),
  content: z.array(FinancialOperationResponseSchema).default([]),
  number: z.number().int().optional(),
  sort: SortObjectSchema.optional(),
  numberOfElements: z.number().int().optional(),
  empty: z.boolean().optional(),
})

export type FinancialOperationRequest = z.infer<typeof FinancialOperationRequestSchema>
export type FinancialOperationResponse = z.infer<typeof FinancialOperationResponseSchema>
export type FinancialOperationSearchCriteria = z.infer<typeof FinancialOperationSearchCriteriaSchema>
export type Pageable = z.infer<typeof PageableSchema>
export type PageFinancialOperationResponse = z.infer<typeof PageFinancialOperationResponseSchema>
