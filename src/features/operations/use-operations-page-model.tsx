import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import type {
  FiltersActionModel,
  FormActionModel,
  PaginationActionModel,
  TriggerActionModel,
} from '#/features/shared/action-models'
import {
  listAccountsFn,
  listUsersFn,
  searchOperationsFn,
} from '#/lib/finance/finance.functions'
import { getErrorMessage } from '#/lib/finance/errors/error-message'
import { financeQueryKeys } from '#/lib/finance/queries/query-keys'
import {
  type AccountResponse,
  FinancialOperationRequestSchema,
  type UserResponse,
} from '#/lib/finance/schemas'
import {
  createBulkOperationItem,
  defaultBulkOperationsForm,
  defaultOperationCreateForm,
  defaultOperationFilters,
  type BulkOperationsFormState,
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

function createDefaultBulkForm(): BulkOperationsFormState {
  return {
    ...defaultBulkOperationsForm,
    items: [createBulkOperationItem()],
  }
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

interface OperationPartyDetails {
  account?: AccountResponse
  user?: UserResponse
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

  const [bulkForm, setBulkForm] = useState<BulkOperationsFormState>(
    createDefaultBulkForm,
  )

  const {
    createMutation,
    deleteMutation,
    bulkMutation,
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
      page,
      size: normalizedFilters.size,
      ...normalizedFilters.criteria,
    }),
    queryFn: () =>
      searchOperationsFn({
        data: {
          page: page - 1,
          size: normalizedFilters.size,
          criteria: normalizedFilters.criteria,
        },
      }),
  })

  const accountsQuery = useQuery({
    queryKey: financeQueryKeys.accounts({}),
    queryFn: () => listAccountsFn({ data: {} }),
  })

  const usersQuery = useQuery({
    queryKey: financeQueryKeys.users,
    queryFn: () => listUsersFn(),
  })

  const accountsById = useMemo(() => {
    const map = new Map<number, AccountResponse>()

    for (const account of accountsQuery.data ?? []) {
      if (typeof account.id === 'number') {
        map.set(account.id, account)
      }
    }

    return map
  }, [accountsQuery.data])

  const usersById = useMemo(() => {
    const map = new Map<number, UserResponse>()

    for (const user of usersQuery.data ?? []) {
      if (typeof user.id === 'number') {
        map.set(user.id, user)
      }
    }

    return map
  }, [usersQuery.data])

  const onFilterSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    setActiveFilters(filtersForm)
    setPage(1)
  }

  const onReset = () => {
    setFiltersForm(createDefaultFilters())
    setActiveFilters(createDefaultFilters())
    setPage(1)
  }

  const onCreateSubmit = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
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
      notifications?.onError?.('Выберите корректные счета отправителя и получателя')
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

  const executeBulk = async () => {
    try {
      const senderUserId = Number(bulkForm.senderUserId)
      const senderAccountId = Number(bulkForm.senderAccountId)

      if (!Number.isFinite(senderUserId) || senderUserId <= 0) {
        notifications?.onError?.('Выберите отправителя')
        return
      }

      if (!Number.isFinite(senderAccountId) || senderAccountId <= 0) {
        notifications?.onError?.('Выберите корректный счет отправителя')
        return
      }

      if (!bulkForm.items.length) {
        notifications?.onError?.('Добавьте хотя бы одну операцию')
        return
      }

      if (
        bulkForm.items.some(
          (item) =>
            item.receiverAccountId.trim().length === 0 ||
            item.amount.trim().length === 0,
        )
      ) {
        notifications?.onError?.(
          'Заполните получателя и сумму для каждой операции',
        )
        return
      }

      const prepared = bulkForm.items.map((item) => ({
        senderAccountId,
        receiverAccountId: Number(item.receiverAccountId),
        amount: Number(item.amount),
        description: item.description.trim() || undefined,
      }))

      const payload = z.array(FinancialOperationRequestSchema).parse(prepared)
      await bulkMutation.mutateAsync(payload)
      setBulkForm(createDefaultBulkForm())
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

  const bulk: TriggerActionModel = {
    onApply: executeBulk,
    isPending: bulkMutation.isPending,
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

  const getPartyDetails = (accountId: number | undefined): OperationPartyDetails => {
    if (typeof accountId !== 'number') {
      return {}
    }

    const account = accountsById.get(accountId)
    const accountUserId = account?.user?.id
    const fallbackUser = account?.user
    const user =
      typeof accountUserId === 'number'
        ? usersById.get(accountUserId) ?? fallbackUser
        : fallbackUser

    return {
      account,
      user,
    }
  }

  return {
    filters,
    create,
    lookups: {
      accounts: accountsQuery.data ?? [],
      users: usersQuery.data ?? [],
    },
    bulk: {
      form: bulkForm,
      setForm: setBulkForm,
      action: bulk,
    },
    table: {
      rows,
      rowsErrorMessage,
      pagination,
      getPartyDetails,
    },
    remove,
  }
}
