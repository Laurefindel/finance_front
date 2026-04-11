import { useMemo, useState, type FormEvent } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import type {
  FiltersActionModel,
  FormActionModel,
  PaginationActionModel,
  TriggerActionModel,
} from '#/features/shared/action-models'
import { searchOperationsFn } from '#/lib/finance/finance.functions'
import { getErrorMessage } from '#/lib/finance/error-utils'
import { financeQueryKeys } from '#/lib/finance/query-keys'
import {
  FinancialOperationRequestSchema,
} from '#/lib/finance/schemas'
import {
  defaultBulkOperationsPayload,
  defaultOperationCreateForm,
  defaultOperationFilters,
  type OperationCreateFormState,
  type OperationFilterState,
} from './types'
import {
  type OperationsPageModelNotifications,
  useOperationsPageModelMutations,
} from './operations-page-model-mutations'

function createDefaultFilters(): OperationFilterState {
  return { ...defaultOperationFilters }
}

function createDefaultOperationForm(): OperationCreateFormState {
  return { ...defaultOperationCreateForm }
}

function parseOptionalNumber(value: string) {
  if (value.trim().length === 0) {
    return undefined
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

interface DeleteOperationAction {
  onDelete: (id: number) => Promise<void>
  isPending: boolean
}

export function useOperationsPageModel(
  notifications?: OperationsPageModelNotifications,
) {
  const queryClient = useQueryClient()

  const [filtersForm, setFiltersForm] =
    useState<OperationFilterState>(createDefaultFilters)
  const [activeFilters, setActiveFilters] =
    useState<OperationFilterState>(createDefaultFilters)
  const [page, setPage] = useState(1)

  const [createForm, setCreateForm] =
    useState<OperationCreateFormState>(createDefaultOperationForm)

  const [bulkPayload, setBulkPayload] = useState(defaultBulkOperationsPayload)

  const {
    createMutation,
    deleteMutation,
    bulkMutation,
    bulkNoTxMutation,
  } = useOperationsPageModelMutations({
    queryClient,
    notifications,
    onCreateSuccess: () => {
      setCreateForm(createDefaultOperationForm())
    },
  })

  const normalizedFilters = useMemo(() => {
    const sizeRaw = Number(activeFilters.size)

    return {
      queryType: activeFilters.queryType,
      size: Number.isFinite(sizeRaw) && sizeRaw > 0 ? sizeRaw : 10,
      criteria: {
        senderUserId: parseOptionalNumber(activeFilters.senderUserId),
        receiverUserId: parseOptionalNumber(activeFilters.receiverUserId),
        currencyCode: activeFilters.currencyCode.trim() || undefined,
        minAmount: parseOptionalNumber(activeFilters.minAmount),
        maxAmount: parseOptionalNumber(activeFilters.maxAmount),
        fromDate: activeFilters.fromDate.trim() || undefined,
        toDate: activeFilters.toDate.trim() || undefined,
      },
    }
  }, [activeFilters])

  const operationsQuery = useQuery({
    queryKey: financeQueryKeys.operationsSearch({
      queryType: normalizedFilters.queryType,
      page,
      size: normalizedFilters.size,
      ...normalizedFilters.criteria,
    }),
    queryFn: () =>
      searchOperationsFn({
        data: {
          queryType: normalizedFilters.queryType,
          page: page - 1,
          size: normalizedFilters.size,
          criteria: normalizedFilters.criteria,
        },
      }),
  })

  const onFilterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setActiveFilters(filtersForm)
    setPage(1)
  }

  const onReset = () => {
    setFiltersForm(createDefaultFilters())
    setActiveFilters(createDefaultFilters())
    setPage(1)
  }

  const onCreateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const senderAccountId = Number(createForm.senderAccountId)
    const receiverAccountId = Number(createForm.receiverAccountId)
    const amount = Number(createForm.amount)

    if (
      !Number.isFinite(senderAccountId) ||
      senderAccountId <= 0 ||
      !Number.isFinite(receiverAccountId) ||
      receiverAccountId <= 0
    ) {
      notifications?.onError?.('Укажите корректные senderAccountId и receiverAccountId')
      return
    }

    if (!Number.isFinite(amount) || amount < 0) {
      notifications?.onError?.('Сумма операции должна быть больше либо равна 0')
      return
    }

    try {
      await createMutation.mutateAsync({
        senderAccountId,
        receiverAccountId,
        amount,
        description: createForm.description.trim() || undefined,
      })
    } catch {
      // onError already shows a toast; swallow to avoid unhandled promise in console.
    }
  }

  const executeBulk = async (mode: 'tx' | 'no-tx') => {
    try {
      const parsed = JSON.parse(bulkPayload)
      const payload = z.array(FinancialOperationRequestSchema).parse(parsed)

      if (mode === 'tx') {
        await bulkMutation.mutateAsync(payload)
      } else {
        await bulkNoTxMutation.mutateAsync(payload)
      }
    } catch (error) {
      notifications?.onError?.(getErrorMessage(error))
    }
  }

  const onDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id)
    } catch {
      // onError already reports the issue.
    }
  }

  const currentPage = (operationsQuery.data?.number ?? page - 1) + 1
  const totalPages = operationsQuery.data?.totalPages ?? 1

  const filters: FiltersActionModel<OperationFilterState> = {
    form: filtersForm,
    setForm: setFiltersForm,
    onApply: onFilterSubmit,
    onReset,
  }

  const create: FormActionModel<OperationCreateFormState> = {
    form: createForm,
    setForm: setCreateForm,
    onApply: onCreateSubmit,
    isPending: createMutation.isPending,
  }

  const transactional: TriggerActionModel = {
    onApply: () => executeBulk('tx'),
    isPending: bulkMutation.isPending,
  }

  const nonTransactional: TriggerActionModel = {
    onApply: () => executeBulk('no-tx'),
    isPending: bulkNoTxMutation.isPending,
  }

  const pagination: PaginationActionModel = {
    currentPage,
    totalPages,
    canPrev: currentPage > 1,
    canNext: currentPage < totalPages,
    onPrev: () => setPage((prev) => Math.max(1, prev - 1)),
    onNext: () => setPage((prev) => prev + 1),
  }

  const rows = operationsQuery.data?.content ?? []
  const rowsErrorMessage = operationsQuery.error
    ? getErrorMessage(operationsQuery.error)
    : null

  const remove: DeleteOperationAction = {
    onDelete,
    isPending: deleteMutation.isPending,
  }

  return {
    filters,
    create,
    bulk: {
      payload: bulkPayload,
      setPayload: setBulkPayload,
      transactional,
      nonTransactional,
    },
    table: {
      rows,
      rowsErrorMessage,
      pagination,
    },
    remove,
  }
}
