import { useMemo, useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '#/components/ui/button'
import type {
  FiltersActionModel,
  FormActionModel,
  PaginationActionModel,
  TableViewModel,
  TriggerActionModel,
} from '#/features/shared/action-models'
import {
  createBulkOperationsFn,
  createBulkOperationsNoTxFn,
  createOperationFn,
  deleteOperationFn,
  searchOperationsFn,
} from '#/lib/finance/finance.functions'
import { getErrorMessage } from '#/lib/finance/error-utils'
import { financeQueryKeys } from '#/lib/finance/query-keys'
import {
  FinancialOperationRequestSchema,
  type FinancialOperationRequest,
  type FinancialOperationResponse,
} from '#/lib/finance/schemas'
import {
  defaultBulkOperationsPayload,
  defaultOperationCreateForm,
  defaultOperationFilters,
  type OperationCreateFormState,
  type OperationFilterState,
} from './types'

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

export function useOperationsPageModel() {
  const queryClient = useQueryClient()

  const [filtersForm, setFiltersForm] =
    useState<OperationFilterState>(createDefaultFilters)
  const [activeFilters, setActiveFilters] =
    useState<OperationFilterState>(createDefaultFilters)
  const [page, setPage] = useState(1)

  const [createForm, setCreateForm] =
    useState<OperationCreateFormState>(createDefaultOperationForm)

  const [bulkPayload, setBulkPayload] = useState(defaultBulkOperationsPayload)

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

  const createMutation = useMutation({
    mutationFn: (payload: FinancialOperationRequest) =>
      createOperationFn({ data: payload }),
    onSuccess: async () => {
      toast.success('Операция создана')
      setCreateForm(createDefaultOperationForm())
      await queryClient.invalidateQueries({ queryKey: ['finance', 'operations'] })
      await queryClient.invalidateQueries({ queryKey: ['finance', 'accounts'] })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteOperationFn({ data: { id } }),
    onSuccess: async () => {
      toast.success('Операция удалена')
      await queryClient.invalidateQueries({ queryKey: ['finance', 'operations'] })
      await queryClient.invalidateQueries({ queryKey: ['finance', 'accounts'] })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  const bulkMutation = useMutation({
    mutationFn: (payload: FinancialOperationRequest[]) =>
      createBulkOperationsFn({ data: payload }),
    onSuccess: async () => {
      toast.success('Bulk операции (transactional) созданы')
      await queryClient.invalidateQueries({ queryKey: ['finance', 'operations'] })
      await queryClient.invalidateQueries({ queryKey: ['finance', 'accounts'] })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  const bulkNoTxMutation = useMutation({
    mutationFn: (payload: FinancialOperationRequest[]) =>
      createBulkOperationsNoTxFn({ data: payload }),
    onSuccess: async () => {
      toast.success('Bulk операции (non-transactional) созданы')
      await queryClient.invalidateQueries({ queryKey: ['finance', 'operations'] })
      await queryClient.invalidateQueries({ queryKey: ['finance', 'accounts'] })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  const columns = useMemo<Array<ColumnDef<FinancialOperationResponse>>>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
      },
      {
        accessorKey: 'senderAccountId',
        header: 'Отправитель',
      },
      {
        accessorKey: 'receiverAccountId',
        header: 'Получатель',
      },
      {
        accessorKey: 'amount',
        header: 'Сумма',
      },
      {
        accessorKey: 'currencyCode',
        header: 'Валюта',
        cell: ({ row }) => row.original.currencyCode ?? '-',
      },
      {
        accessorKey: 'description',
        header: 'Описание',
        cell: ({ row }) => row.original.description ?? '-',
      },
      {
        id: 'actions',
        header: 'Действия',
        cell: ({ row }) => {
          const id = row.original.id

          return (
            <Button
              variant="destructive"
              size="sm"
              disabled={!id || deleteMutation.isPending}
              onClick={() => {
                if (!id) {
                  return
                }

                if (window.confirm(`Удалить операцию #${id}?`)) {
                  deleteMutation.mutate(id)
                }
              }}
            >
              Удалить
            </Button>
          )
        },
      },
    ],
    [deleteMutation],
  )

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
      toast.error('Укажите корректные senderAccountId и receiverAccountId')
      return
    }

    if (!Number.isFinite(amount) || amount < 0) {
      toast.error('Сумма операции должна быть больше либо равна 0')
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
      toast.error(getErrorMessage(error))
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

  const table: TableViewModel<FinancialOperationResponse> & {
    pagination: PaginationActionModel
  } = {
    columns,
    rows: operationsQuery.data?.content ?? [],
    rowsErrorMessage: operationsQuery.error ? getErrorMessage(operationsQuery.error) : null,
    pagination,
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
    table,
  }
}
