import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { financeRequest } from './finance.server'
import {
  AccountRequestSchema,
  AccountResponseSchema,
  AsyncTaskMetricsSchema,
  AsyncTaskStatusSchema,
  AsyncTaskSubmissionSchema,
  CurrencyRequestSchema,
  CurrencyResponseSchema,
  FinancialOperationRequestSchema,
  FinancialOperationResponseSchema,
  FinancialOperationSearchCriteriaSchema,
  PageFinancialOperationResponseSchema,
  RaceConditionDemoSchema,
  RoleSchema,
  UserRequestSchema,
  UserResponseSchema,
  type AccountResponse,
  type AsyncTaskMetrics,
  type AsyncTaskStatus,
  type AsyncTaskSubmission,
  type CurrencyResponse,
  type FinancialOperationResponse,
  type PageFinancialOperationResponse,
  type RaceConditionDemo,
  type Role,
  type UserResponse,
} from './schemas'

const idSchema = z.object({
  id: z.number().int().positive(),
})

const listAccountsInputSchema = z.object({
  userId: z.number().int().positive().optional(),
  currency: z.string().trim().max(3).optional(),
})

const listOperationsInputSchema = z.object({
  senderUserId: z.number().int().positive().optional(),
})

const updateCurrencyInputSchema = z.object({
  id: z.number().int().positive(),
  payload: CurrencyRequestSchema,
})

const updateUserInputSchema = z.object({
  id: z.number().int().positive(),
  payload: UserRequestSchema,
})

const replenishInputSchema = z.object({
  id: z.number().int().positive(),
  amount: z.number().min(0),
})

const searchOperationsInputSchema = z.object({
  queryType: z.string().default('jpql'),
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).max(100).default(10),
  sort: z.array(z.string()).optional(),
  criteria: FinancialOperationSearchCriteriaSchema.default({}),
})

const asyncReplenishInputSchema = z.object({
  accountId: z.number().int().positive(),
  amount: z.number().min(0),
})

const asyncStatusInputSchema = z.object({
  taskId: z.string().trim().min(1),
})

const raceDemoInputSchema = z.object({
  threads: z.number().int().min(50).default(64),
  incrementsPerThread: z.number().int().min(1).default(10000),
})

export const listUsersFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<UserResponse[]> => {
    return financeRequest({
      path: '/users/all',
      method: 'GET',
      schema: z.array(UserResponseSchema),
    })
  },
)

export const createUserFn = createServerFn({ method: 'POST' })
  .inputValidator(UserRequestSchema)
  .handler(async ({ data }): Promise<UserResponse> => {
    return financeRequest({
      path: '/users/register',
      method: 'POST',
      body: data,
      schema: UserResponseSchema,
    })
  })

export const updateUserFn = createServerFn({ method: 'POST' })
  .inputValidator(updateUserInputSchema)
  .handler(async ({ data }): Promise<UserResponse> => {
    return financeRequest({
      path: `/users/${data.id}/change-user-information`,
      method: 'PATCH',
      body: data.payload,
      schema: UserResponseSchema,
    })
  })

export const deleteUserFn = createServerFn({ method: 'POST' })
  .inputValidator(idSchema)
  .handler(async ({ data }): Promise<{ success: true }> => {
    await financeRequest({
      path: `/users/${data.id}`,
      method: 'DELETE',
    })

    return { success: true }
  })

export const listRolesFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Role[]> => {
    return financeRequest({
      path: '/roles',
      method: 'GET',
      schema: z.array(RoleSchema),
    })
  },
)

export const createRoleFn = createServerFn({ method: 'POST' })
  .inputValidator(RoleSchema.pick({ name: true }))
  .handler(async ({ data }): Promise<Role> => {
    return financeRequest({
      path: '/roles',
      method: 'POST',
      body: data,
      schema: RoleSchema,
    })
  })

export const deleteRoleFn = createServerFn({ method: 'POST' })
  .inputValidator(idSchema)
  .handler(async ({ data }): Promise<{ success: true }> => {
    await financeRequest({
      path: `/roles/${data.id}`,
      method: 'DELETE',
    })

    return { success: true }
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

export const deleteCurrencyFn = createServerFn({ method: 'POST' })
  .inputValidator(idSchema)
  .handler(async ({ data }): Promise<{ success: true }> => {
    await financeRequest({
      path: `/currencies/${data.id}`,
      method: 'DELETE',
    })

    return { success: true }
  })

export const listAccountsFn = createServerFn({ method: 'POST' })
  .inputValidator(listAccountsInputSchema)
  .handler(async ({ data }): Promise<AccountResponse[]> => {
    return financeRequest({
      path: '/accounts',
      method: 'GET',
      query: {
        userId: data.userId,
        currency: data.currency,
      },
      schema: z.array(AccountResponseSchema),
    })
  })

export const createAccountFn = createServerFn({ method: 'POST' })
  .inputValidator(AccountRequestSchema)
  .handler(async ({ data }): Promise<AccountResponse> => {
    return financeRequest({
      path: '/accounts',
      method: 'POST',
      body: data,
      schema: AccountResponseSchema,
    })
  })

export const replenishAccountFn = createServerFn({ method: 'POST' })
  .inputValidator(replenishInputSchema)
  .handler(async ({ data }): Promise<AccountResponse> => {
    return financeRequest({
      path: `/accounts/${data.id}/replenish/${data.amount}`,
      method: 'PATCH',
      schema: AccountResponseSchema,
    })
  })

export const deleteAccountFn = createServerFn({ method: 'POST' })
  .inputValidator(idSchema)
  .handler(async ({ data }): Promise<{ success: true }> => {
    await financeRequest({
      path: `/accounts/${data.id}`,
      method: 'DELETE',
    })

    return { success: true }
  })

export const listOperationsFn = createServerFn({ method: 'POST' })
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

export const getAsyncStatusFn = createServerFn({ method: 'POST' })
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
