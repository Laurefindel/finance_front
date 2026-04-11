import { useMutation, type QueryClient } from '@tanstack/react-query'
import {
  createBulkOperationsFn,
  createBulkOperationsNoTxFn,
  createOperationFn,
  deleteOperationFn,
} from '#/lib/finance/finance.functions'
import { getErrorMessage } from '#/lib/finance/error-utils'
import type { FinancialOperationRequest } from '#/lib/finance/schemas'

export interface OperationsPageModelNotifications {
  onSuccess?: (message: string) => void
  onError?: (message: string) => void
}

interface UseOperationsPageModelMutationsOptions {
  queryClient: QueryClient
  notifications?: OperationsPageModelNotifications
  onCreateSuccess: () => void
}

async function invalidateOperationsAndAccounts(queryClient: QueryClient) {
  await queryClient.invalidateQueries({ queryKey: ['finance', 'operations'] })
  await queryClient.invalidateQueries({ queryKey: ['finance', 'accounts'] })
}

export function useOperationsPageModelMutations({
  queryClient,
  notifications,
  onCreateSuccess,
}: UseOperationsPageModelMutationsOptions) {
  const createMutation = useMutation({
    mutationFn: (payload: FinancialOperationRequest) =>
      createOperationFn({ data: payload }),
    onSuccess: async () => {
      notifications?.onSuccess?.('Операция создана')
      onCreateSuccess()
      await invalidateOperationsAndAccounts(queryClient)
    },
    onError: (error) => {
      notifications?.onError?.(getErrorMessage(error))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteOperationFn({ data: { id } }),
    onSuccess: async () => {
      notifications?.onSuccess?.('Операция удалена')
      await invalidateOperationsAndAccounts(queryClient)
    },
    onError: (error) => {
      notifications?.onError?.(getErrorMessage(error))
    },
  })

  const bulkMutation = useMutation({
    mutationFn: (payload: FinancialOperationRequest[]) =>
      createBulkOperationsFn({ data: payload }),
    onSuccess: async () => {
      notifications?.onSuccess?.('Bulk операции (transactional) созданы')
      await invalidateOperationsAndAccounts(queryClient)
    },
    onError: (error) => {
      notifications?.onError?.(getErrorMessage(error))
    },
  })

  const bulkNoTxMutation = useMutation({
    mutationFn: (payload: FinancialOperationRequest[]) =>
      createBulkOperationsNoTxFn({ data: payload }),
    onSuccess: async () => {
      notifications?.onSuccess?.('Bulk операции (non-transactional) созданы')
      await invalidateOperationsAndAccounts(queryClient)
    },
    onError: (error) => {
      notifications?.onError?.(getErrorMessage(error))
    },
  })

  return {
    createMutation,
    deleteMutation,
    bulkMutation,
    bulkNoTxMutation,
  }
}
