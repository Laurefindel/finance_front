import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  FormActionModel,
} from '#/features/shared/action-models'
import {
  createUserFn,
  deleteUserFn,
  listUsersFn,
} from '#/lib/finance/finance.functions'
import { getErrorMessage } from '#/lib/finance/error-utils'
import { financeQueryKeys } from '#/lib/finance/query-keys'
import type { UserRequest, UserResponse } from '#/lib/finance/schemas'
import { defaultUserFormState, type UserFormState } from './types'

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

interface UsersPageModelNotifications {
  onSuccess?: (message: string) => void
  onError?: (message: string) => void
}

interface DeleteUserAction {
  onDelete: (id: number) => Promise<void>
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

  const onApply = async (event: FormEvent<HTMLFormElement>) => {
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

  const rows = (usersQuery.data ?? []).map(normalizeUser)
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
  }
}
