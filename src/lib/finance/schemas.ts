import { z } from 'zod'

const positiveIntSchema = z.number().int().positive()
const nonNegativeNumberSchema = z.number().min(0)

export const ApiValidationErrorsSchema = z.record(z.string(), z.string())

export const ApiProblemSchema = z.object({
  timestamp: z.string().optional(),
  status: z.number().int().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
  path: z.string().optional(),
  validationErrors: ApiValidationErrorsSchema.nullish(),
})

export const CurrencyRequestSchema = z.object({
  code: z.string().trim().length(3),
  name: z.string().trim().min(1).max(100),
})

export const CurrencyResponseSchema = z.object({
  id: z.number().int().optional(),
  code: z.string().trim(),
  name: z.string().trim(),
})

export const UserRequestSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.string().trim().email(),
  password: z.string().min(1),
})

export const UserResponseSchema = z.object({
  id: z.number().int().optional(),
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
  email: z.string().trim().optional(),
  status: z.string().trim().optional(),
  accountsIds: z.array(z.number().int()).optional().default([]),
  roleIds: z.array(z.number().int()).optional().default([]),
})

export const RoleSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().trim().min(1).max(50),
})

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
  description: z.string().optional(),
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

export const RaceConditionDemoSchema = z.object({
  threads: z.number().int().optional(),
  incrementsPerThread: z.number().int().optional(),
  expected: z.number().int().optional(),
  unsafeCounter: z.number().int().optional(),
  synchronizedCounter: z.number().int().optional(),
  atomicCounter: z.number().int().optional(),
  raceConditionDetected: z.boolean().optional(),
})

export type ApiProblem = z.infer<typeof ApiProblemSchema>
export type CurrencyRequest = z.infer<typeof CurrencyRequestSchema>
export type CurrencyResponse = z.infer<typeof CurrencyResponseSchema>
export type UserRequest = z.infer<typeof UserRequestSchema>
export type UserResponse = z.infer<typeof UserResponseSchema>
export type Role = z.infer<typeof RoleSchema>
export type FinancialOperationRequest = z.infer<typeof FinancialOperationRequestSchema>
export type FinancialOperationResponse = z.infer<typeof FinancialOperationResponseSchema>
export type FinancialOperationSearchCriteria = z.infer<typeof FinancialOperationSearchCriteriaSchema>
export type Pageable = z.infer<typeof PageableSchema>
export type PageFinancialOperationResponse = z.infer<typeof PageFinancialOperationResponseSchema>
export type AccountRequest = z.infer<typeof AccountRequestSchema>
export type AccountResponse = z.infer<typeof AccountResponseSchema>
export type AsyncTaskSubmission = z.infer<typeof AsyncTaskSubmissionSchema>
export type AsyncTaskStatus = z.infer<typeof AsyncTaskStatusSchema>
export type AsyncTaskMetrics = z.infer<typeof AsyncTaskMetricsSchema>
export type RaceConditionDemo = z.infer<typeof RaceConditionDemoSchema>
