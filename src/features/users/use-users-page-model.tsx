import { useMemo, useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import type {
  FormActionModel,
  TableViewModel,
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

export function useUsersPageModel() {
  const queryClient = useQueryClient()

  const [form, setForm] = useState<UserFormState>(createDefaultUserForm)

  const usersQuery = useQuery({
    queryKey: financeQueryKeys.users,
    queryFn: () => listUsersFn(),
  })

  const createUserMutation = useMutation({
    mutationFn: (payload: UserRequest) => createUserFn({ data: payload }),
    onSuccess: (createdUser) => {
      toast.success('Пользователь создан')
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
      toast.error(getErrorMessage(error))
    },
  })

  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => deleteUserFn({ data: { id } }),
    onSuccess: (_, deletedId) => {
      toast.success('Пользователь удален')

      queryClient.setQueryData<UserResponse[]>(
        financeQueryKeys.users,
        (previous = []) => previous.filter((item) => item.id !== deletedId),
      )
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  const columns = useMemo<Array<ColumnDef<UserResponse>>>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
      },
      {
        accessorKey: 'firstName',
        header: 'Имя',
      },
      {
        accessorKey: 'lastName',
        header: 'Фамилия',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'status',
        header: 'Статус',
        cell: ({ row }) => (
          <Badge variant="secondary">{row.original.status ?? 'N/A'}</Badge>
        ),
      },
      {
        id: 'accounts',
        header: 'Счета',
        cell: ({ row }) => row.original.accountsIds?.length ?? 0,
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
              disabled={!id || deleteUserMutation.isPending}
              onClick={() => {
                if (!id) {
                  return
                }

                if (window.confirm(`Удалить пользователя #${id}?`)) {
                  deleteUserMutation.mutate(id)
                }
              }}
            >
              Удалить
            </Button>
          )
        },
      },
    ],
    [deleteUserMutation],
  )

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

  const rows = (usersQuery.data ?? []).map(normalizeUser)
  const rowsErrorMessage = usersQuery.error ? getErrorMessage(usersQuery.error) : null
  const hasRows = rows.length > 0

  const create: FormActionModel<UserFormState> = {
    form,
    setForm,
    onApply,
    isPending: createUserMutation.isPending,
  }

  const table: TableViewModel<UserResponse> = {
    columns,
    rows,
    rowsErrorMessage,
  }

  return {
    form: create.form,
    setForm: create.setForm,
    onApply: create.onApply,
    columns: table.columns,
    rows: table.rows,
    rowsErrorMessage: table.rowsErrorMessage,
    isSubmitPending: create.isPending,
    isInitialLoading: usersQuery.isLoading && !hasRows,
    isFatalError: Boolean(usersQuery.error) && !hasRows,
    hasRefreshError: Boolean(usersQuery.error) && hasRows,
  }
}
