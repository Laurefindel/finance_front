import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  FormActionModel,
} from '#/features/shared/action-models'
import {
  listAccountsFn,
  createUserFn,
  deleteUserFn,
  listUsersFn,
  updateUserFn,
} from '#/lib/finance/finance.functions'
import { getErrorMessage } from '#/lib/finance/errors/error-message'
import { financeQueryKeys } from '#/lib/finance/queries/query-keys'
import type { AccountResponse, UserRequest, UserResponse } from '#/lib/finance/schemas'
import {
  defaultUserFormState,
  type UserAccountSummary,
  type UserFormState,
  type UserTableRow,
} from './types'

function createDefaultUserForm(): UserFormState {
  return { ...defaultUserFormState }
}

function normalizeUser(user: UserResponse): UserResponse {
  return {
    ...user,
    accountsIds: user.accountsIds ?? [],
    roleIds: user.roleIds ?? [],
  }
}

function normalizeAccountSummary(account: AccountResponse): UserAccountSummary | null {
  const accountId = account.id
  const userId = account.user?.id

  if (typeof accountId !== 'number' || typeof userId !== 'number') {
    return null
  }

  return {
    id: accountId,
    balance: account.balance,
    currencyCode: account.currency?.code?.trim().toUpperCase() || '---',
    currencyName: account.currency?.name?.trim() || 'Без названия',
  }
}

function buildAccountsByUser(accounts: AccountResponse[]) {
  const byUserId = new Map<number, UserAccountSummary[]>()

  accounts.forEach((account) => {
    const userId = account.user?.id
    const summary = normalizeAccountSummary(account)

    if (typeof userId !== 'number' || !summary) {
      return
    }

    const current = byUserId.get(userId) ?? []
    current.push(summary)
    byUserId.set(userId, current)
  })

  return byUserId
}

interface UsersPageModelNotifications {
  onSuccess?: (message: string) => void
  onError?: (message: string) => void
}

interface DeleteUserAction {
  onDelete: (id: number) => Promise<void>
  isPending: boolean
}

interface UpdateUserPayload {
  firstName: string
  lastName: string
  email: string
  password: string
}

interface UpdateUserAction {
  onUpdate: (id: number, payload: UpdateUserPayload) => Promise<void>
  isPending: boolean
}

export function useUsersPageModel(
  notifications?: UsersPageModelNotifications,
) {
  const queryClient = useQueryClient()

  const [form, setForm] = useState<UserFormState>(createDefaultUserForm)

  const usersQuery = useQuery({
    queryKey: financeQueryKeys.users,
    queryFn: () => listUsersFn(),
  })

  const accountsQuery = useQuery({
    queryKey: financeQueryKeys.accounts({}),
    queryFn: () => listAccountsFn({ data: {} }),
  })

  const createUserMutation = useMutation({
    mutationFn: (payload: UserRequest) => createUserFn({ data: payload }),
    onSuccess: (createdUser) => {
      notifications?.onSuccess?.('Пользователь создан')
      setForm(createDefaultUserForm())

      queryClient.setQueryData<UserResponse[]>(
        financeQueryKeys.users,
        (previous = []) => {
          const nextUser = normalizeUser(createdUser)

          if (nextUser.id) {
            const exists = previous.some((item) => item.id === nextUser.id)
            if (exists) {
              return previous.map((item) =>
                item.id === nextUser.id ? nextUser : item,
              )
            }
          }

          return [nextUser, ...previous]
        },
      )
    },
    onError: (error) => {
      notifications?.onError?.(getErrorMessage(error))
    },
  })

  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => deleteUserFn({ data: { id } }),
    onSuccess: (_, deletedId) => {
      notifications?.onSuccess?.('Пользователь удален')

      queryClient.setQueryData<UserResponse[]>(
        financeQueryKeys.users,
        (previous = []) => previous.filter((item) => item.id !== deletedId),
      )
    },
    onError: (error) => {
      notifications?.onError?.(getErrorMessage(error))
    },
  })

  const updateUserMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateUserPayload }) =>
      updateUserFn({ data: { id, payload } }),
    onSuccess: (updatedUser) => {
      notifications?.onSuccess?.('Пользователь обновлен')

      queryClient.setQueryData<UserResponse[]>(
        financeQueryKeys.users,
        (previous = []) => {
          const nextUser = normalizeUser(updatedUser)

          if (!nextUser.id) {
            return previous
          }

          return previous.map((item) =>
            item.id === nextUser.id ? nextUser : item,
          )
        },
      )
    },
    onError: (error) => {
      notifications?.onError?.(getErrorMessage(error))
    },
  })

  const onApply = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      await createUserMutation.mutateAsync({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
      })
    } catch {
      // onError already shows a toast; swallow to avoid unhandled promise in console.
    }
  }

  const onDelete = async (id: number) => {
    try {
      await deleteUserMutation.mutateAsync(id)
    } catch {
      // onError already reports the issue.
    }
  }

  const onUpdate = async (id: number, payload: UpdateUserPayload) => {
    try {
      await updateUserMutation.mutateAsync({ id, payload })
    } catch {
      // onError already reports the issue.
    }
  }

  const accountsByUser = useMemo(
    () => buildAccountsByUser(accountsQuery.data ?? []),
    [accountsQuery.data],
  )

  const rows: UserTableRow[] = useMemo(
    () =>
      (usersQuery.data ?? []).map((user) => {
        const normalizedUser = normalizeUser(user)
        const userId = normalizedUser.id

        return {
          ...normalizedUser,
          accountsSummary:
            typeof userId === 'number' ? (accountsByUser.get(userId) ?? []) : [],
        }
      }),
    [usersQuery.data, accountsByUser],
  )
  const rowsErrorMessage = usersQuery.error ? getErrorMessage(usersQuery.error) : null
  const hasRows = rows.length > 0

  const create: FormActionModel<UserFormState> = {
    form,
    setForm,
    onApply,
    isPending: createUserMutation.isPending,
  }

  const remove: DeleteUserAction = {
    onDelete,
    isPending: deleteUserMutation.isPending,
  }

  const update: UpdateUserAction = {
    onUpdate,
    isPending: updateUserMutation.isPending,
  }

  return {
    form: create.form,
    setForm: create.setForm,
    onApply: create.onApply,
    rows,
    rowsErrorMessage,
    isSubmitPending: create.isPending,
    isInitialLoading: usersQuery.isLoading && !hasRows,
    isFatalError: Boolean(usersQuery.error) && !hasRows,
    hasRefreshError: Boolean(usersQuery.error) && hasRows,
    remove,
    update,
  }
}
