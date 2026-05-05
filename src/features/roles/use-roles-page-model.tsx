import { useState, type SyntheticEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  FormActionModel,
  TableViewModel,
} from '#/features/shared/action-models'
import type { ColumnDef } from '@tanstack/react-table'
import {
  assignUserRoleFn,
  createRoleFn,
  deleteRoleFn,
  listRolesFn,
  listUsersFn,
  removeUserRoleFn,
} from '#/lib/finance/finance.functions'
import { getErrorMessage } from '#/lib/finance/errors/error-message'
import { financeQueryKeys } from '#/lib/finance/queries/query-keys'
import type { Role, UserResponse } from '#/lib/finance/schemas'
import { defaultCreateRoleForm, type CreateRoleFormState } from './types'

function createDefaultRoleForm(): CreateRoleFormState {
  return { ...defaultCreateRoleForm }
}

function normalizeUser(user: UserResponse): UserResponse {
  return {
    ...user,
    accountsIds: user.accountsIds ?? [],
    roleIds: user.roleIds ?? [],
    roles: user.roles ?? [],
  }
}

interface RolesPageModelNotifications {
  onSuccess?: (message: string) => void
  onError?: (message: string) => void
}

interface DeleteRoleAction {
  onDelete: (id: number) => Promise<void>
  isPending: boolean
}

interface RoleAssignmentAction {
  onAssign: (userId: number, roleId: number) => Promise<void>
  onRemove: (userId: number, roleId: number) => Promise<void>
  isAssignPending: boolean
  isRemovePending: boolean
}

export function useRolesPageModel(
  notifications?: RolesPageModelNotifications,
) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<CreateRoleFormState>(createDefaultRoleForm)

  const rolesQuery = useQuery({
    queryKey: financeQueryKeys.roles,
    queryFn: () => listRolesFn(),
  })

  const usersQuery = useQuery({
    queryKey: financeQueryKeys.users,
    queryFn: () => listUsersFn(),
  })

  const createRoleMutation = useMutation({
    mutationFn: (payload: { name: string }) => createRoleFn({ data: payload }),
    onSuccess: async () => {
      notifications?.onSuccess?.('Роль создана')
      setForm(createDefaultRoleForm())
      await queryClient.invalidateQueries({ queryKey: financeQueryKeys.roles })
    },
    onError: (error) => {
      notifications?.onError?.(getErrorMessage(error))
    },
  })

  const deleteRoleMutation = useMutation({
    mutationFn: (id: number) => deleteRoleFn({ data: { id } }),
    onSuccess: async (_, deletedId) => {
      notifications?.onSuccess?.('Роль удалена')
      queryClient.setQueryData<Role[]>(
        financeQueryKeys.roles,
        (previous = []) => previous.filter((item) => item.id !== deletedId),
      )
      await queryClient.invalidateQueries({ queryKey: financeQueryKeys.roles })
    },
    onError: (error) => {
      notifications?.onError?.(getErrorMessage(error))
    },
  })

  const assignRoleMutation = useMutation({
    mutationFn: ({ userId, roleId }: { userId: number; roleId: number }) =>
      assignUserRoleFn({ data: { id: userId, roleId } }),
    onSuccess: (updatedUser) => {
      notifications?.onSuccess?.('Роль назначена')

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

  const removeRoleMutation = useMutation({
    mutationFn: ({ userId, roleId }: { userId: number; roleId: number }) =>
      removeUserRoleFn({ data: { id: userId, roleId } }),
    onSuccess: (updatedUser) => {
      notifications?.onSuccess?.('Роль удалена у пользователя')

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

  const onApply = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      await createRoleMutation.mutateAsync({ name: form.name.trim() })
    } catch {
      // onError already shows a toast; swallow to avoid unhandled promise in console.
    }
  }

  const onDelete = async (id: number) => {
    try {
      await deleteRoleMutation.mutateAsync(id)
    } catch {
      // onError already reports the issue.
    }
  }

  const onAssign = async (userId: number, roleId: number) => {
    try {
      await assignRoleMutation.mutateAsync({ userId, roleId })
    } catch {
      // onError already reports the issue.
    }
  }

  const onRemove = async (userId: number, roleId: number) => {
    try {
      await removeRoleMutation.mutateAsync({ userId, roleId })
    } catch {
      // onError already reports the issue.
    }
  }

  const create: FormActionModel<CreateRoleFormState> = {
    form,
    setForm,
    onApply,
    isPending: createRoleMutation.isPending,
  }

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
  ]

  const table: TableViewModel<Role> = {
    columns,
    rows: rolesQuery.data ?? [],
    rowsErrorMessage: rolesQuery.error ? getErrorMessage(rolesQuery.error) : null,
  }

  const remove: DeleteRoleAction = {
    onDelete,
    isPending: deleteRoleMutation.isPending,
  }

  const assignments: RoleAssignmentAction = {
    onAssign,
    onRemove,
    isAssignPending: assignRoleMutation.isPending,
    isRemovePending: removeRoleMutation.isPending,
  }

  return {
    form: create.form,
    setForm: create.setForm,
    onApply: create.onApply,
    rows: table.rows,
    rowsErrorMessage: table.rowsErrorMessage,
    isSubmitPending: create.isPending,
    remove,
    users: usersQuery.data?.map(normalizeUser) ?? [],
    assignments,
  }
}
