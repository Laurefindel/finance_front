import { useCallback, useMemo, useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { FormActionModel } from '#/features/shared/action-models'
import {
  createAccountFn,
  deleteAccountFn,
  listAccountsFn,
  replenishAccountFn,
} from '#/lib/finance/finance.functions'
import { getErrorMessage } from '#/lib/finance/errors/error-message'
import { financeQueryKeys } from '#/lib/finance/queries/query-keys'
import type { AccountResponse } from '#/lib/finance/schemas'
import {
  defaultAccountsFilters,
  defaultCreateAccountForm,
  defaultReplenishAccountForm,
  type AccountsFiltersState,
  type CreateAccountFormState,
  type ReplenishAccountFormState,
} from './types'

interface AccountsPageNotifications {
  onSuccess?: (message: string) => void
  onError?: (message: string) => void
}

function createDefaultFilters(): AccountsFiltersState {
  return { ...defaultAccountsFilters }
}

function createDefaultCreateForm(): CreateAccountFormState {
  return { ...defaultCreateAccountForm }
}

function createDefaultReplenishForm(): ReplenishAccountFormState {
  return { ...defaultReplenishAccountForm }
}

function getSortableAccountId(account: AccountResponse) {
  return typeof account.id === 'number' ? account.id : Number.MAX_SAFE_INTEGER
}

function noop() {}

export function useAccountsPageModel(
  notifications: AccountsPageNotifications = {},
) {
  const queryClient = useQueryClient()
  const notifySuccess = notifications.onSuccess ?? noop
  const notifyError = notifications.onError ?? noop

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

  const rows = useMemo(() => {
    if (!accountsQuery.data) {
      return []
    }

    return [...accountsQuery.data].sort(
      (left, right) => getSortableAccountId(left) - getSortableAccountId(right),
    )
  }, [accountsQuery.data])

  const createAccountMutation = useMutation({
    mutationFn: (payload: { userId: number; currencyId: number }) =>
      createAccountFn({ data: payload }),
    onSuccess: async () => {
      notifySuccess('Счет создан')
      setCreateForm(createDefaultCreateForm())
      await queryClient.invalidateQueries({ queryKey: ['finance', 'accounts'] })
    },
    onError: (error) => {
      notifyError(getErrorMessage(error))
    },
  })

  const replenishMutation = useMutation({
    mutationFn: (payload: { id: number; amount: number }) =>
      replenishAccountFn({ data: payload }),
    onSuccess: async () => {
      notifySuccess('Баланс успешно пополнен')
      setReplenishForm(createDefaultReplenishForm())
      await queryClient.invalidateQueries({ queryKey: ['finance', 'accounts'] })
    },
    onError: (error) => {
      notifyError(getErrorMessage(error))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAccountFn({ data: { id } }),
    onSuccess: async () => {
      notifySuccess('Счет удален')
      await queryClient.invalidateQueries({ queryKey: ['finance', 'accounts'] })
    },
    onError: (error) => {
      notifyError(getErrorMessage(error))
    },
  })

  const onDelete = useCallback(
    async (id: number) => {
      await deleteMutation.mutateAsync(id)
    },
    [deleteMutation],
  )

  const onCreateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const userId = Number(createForm.userId)
    const currencyId = Number(createForm.currencyId)

    if (
      !Number.isInteger(userId) ||
      userId <= 0 ||
      !Number.isInteger(currencyId) ||
      currencyId <= 0
    ) {
      notifyError('Укажите целочисленные userId и currencyId больше 0')
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

    if (!Number.isInteger(id) || id <= 0 || !Number.isFinite(amount) || amount < 0) {
      notifyError('Укажите корректные id и amount')
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

  return {
    filters: {
      form: filters,
      setForm: setFilters,
      onReset: () => setFilters(createDefaultFilters()),
    },
    create,
    replenish,
    delete: {
      onDelete,
      isPending: deleteMutation.isPending,
    },
    rows,
    rowsErrorMessage: accountsQuery.error ? getErrorMessage(accountsQuery.error) : null,
  }
}
