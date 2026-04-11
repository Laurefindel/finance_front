import { useMemo, useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import { Button } from '#/components/ui/button'
import type {
  FormActionModel,
  TableViewModel,
} from '#/features/shared/action-models'
import {
  createAccountFn,
  deleteAccountFn,
  listAccountsFn,
  replenishAccountFn,
} from '#/lib/finance/finance.functions'
import { getErrorMessage } from '#/lib/finance/error-utils'
import { financeQueryKeys } from '#/lib/finance/query-keys'
import type { AccountResponse } from '#/lib/finance/schemas'
import {
  defaultAccountsFilters,
  defaultCreateAccountForm,
  defaultReplenishAccountForm,
  type AccountsFiltersState,
  type CreateAccountFormState,
  type ReplenishAccountFormState,
} from './types'

function createDefaultFilters(): AccountsFiltersState {
  return { ...defaultAccountsFilters }
}

function createDefaultCreateForm(): CreateAccountFormState {
  return { ...defaultCreateAccountForm }
}

function createDefaultReplenishForm(): ReplenishAccountFormState {
  return { ...defaultReplenishAccountForm }
}

export function useAccountsPageModel() {
  const queryClient = useQueryClient()

  const [filters, setFilters] = useState<AccountsFiltersState>(createDefaultFilters)
  const [createForm, setCreateForm] =
    useState<CreateAccountFormState>(createDefaultCreateForm)
  const [replenishForm, setReplenishForm] =
    useState<ReplenishAccountFormState>(createDefaultReplenishForm)

  const normalizedFilters = useMemo(() => {
    const rawUserId =
      filters.userId.trim().length > 0 ? Number(filters.userId.trim()) : undefined

    return {
      userId:
        rawUserId !== undefined && Number.isFinite(rawUserId)
          ? rawUserId
          : undefined,
      currency:
        filters.currency.trim().length > 0
          ? filters.currency.trim().toUpperCase()
          : undefined,
    }
  }, [filters])

  const accountsQuery = useQuery({
    queryKey: financeQueryKeys.accounts(normalizedFilters),
    queryFn: () => listAccountsFn({ data: normalizedFilters }),
  })

  const createAccountMutation = useMutation({
    mutationFn: (payload: { userId: number; currencyId: number }) =>
      createAccountFn({ data: payload }),
    onSuccess: async () => {
      toast.success('Счет создан')
      setCreateForm(createDefaultCreateForm())
      await queryClient.invalidateQueries({ queryKey: ['finance', 'accounts'] })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  const replenishMutation = useMutation({
    mutationFn: (payload: { id: number; amount: number }) =>
      replenishAccountFn({ data: payload }),
    onSuccess: async () => {
      toast.success('Баланс успешно пополнен')
      setReplenishForm(createDefaultReplenishForm())
      await queryClient.invalidateQueries({ queryKey: ['finance', 'accounts'] })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAccountFn({ data: { id } }),
    onSuccess: async () => {
      toast.success('Счет удален')
      await queryClient.invalidateQueries({ queryKey: ['finance', 'accounts'] })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  const columns = useMemo<Array<ColumnDef<AccountResponse>>>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
      },
      {
        accessorKey: 'balance',
        header: 'Баланс',
        cell: ({ row }) => {
          const value = row.original.balance
          return value === undefined ? '-' : Number(value).toFixed(2)
        },
      },
      {
        id: 'owner',
        header: 'Владелец',
        cell: ({ row }) => {
          const user = row.original.user
          if (!user) {
            return '-'
          }

          return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || '-'
        },
      },
      {
        id: 'currency',
        header: 'Валюта',
        cell: ({ row }) => row.original.currency?.code ?? '-',
      },
      {
        id: 'incoming',
        header: 'Входящие',
        cell: ({ row }) => row.original.incomingOperations?.length ?? 0,
      },
      {
        id: 'outcoming',
        header: 'Исходящие',
        cell: ({ row }) => row.original.outcomingOperations?.length ?? 0,
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

                if (window.confirm(`Удалить счет #${id}?`)) {
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

  const onCreateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const userId = Number(createForm.userId)
    const currencyId = Number(createForm.currencyId)

    if (!Number.isFinite(userId) || !Number.isFinite(currencyId)) {
      toast.error('Укажите корректные userId и currencyId')
      return
    }

    try {
      await createAccountMutation.mutateAsync({ userId, currencyId })
    } catch {
      // onError already shows a toast; swallow to avoid unhandled promise in console.
    }
  }

  const onReplenishSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const id = Number(replenishForm.id)
    const amount = Number(replenishForm.amount)

    if (!Number.isFinite(id) || !Number.isFinite(amount)) {
      toast.error('Укажите корректные id и amount')
      return
    }

    try {
      await replenishMutation.mutateAsync({ id, amount })
    } catch {
      // onError already shows a toast; swallow to avoid unhandled promise in console.
    }
  }

  const create: FormActionModel<CreateAccountFormState> = {
    form: createForm,
    setForm: setCreateForm,
    onApply: onCreateSubmit,
    isPending: createAccountMutation.isPending,
  }

  const replenish: FormActionModel<ReplenishAccountFormState> = {
    form: replenishForm,
    setForm: setReplenishForm,
    onApply: onReplenishSubmit,
    isPending: replenishMutation.isPending,
  }

  const table: TableViewModel<AccountResponse> = {
    columns,
    rows: accountsQuery.data ?? [],
    rowsErrorMessage: accountsQuery.error ? getErrorMessage(accountsQuery.error) : null,
  }

  return {
    filters: {
      form: filters,
      setForm: setFilters,
      onReset: () => setFilters(createDefaultFilters()),
    },
    create,
    replenish,
    table,
  }
}
