import { useState, type SyntheticEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  FormActionModel,
  TableViewModel,
} from '#/features/shared/action-models'
import type { ColumnDef } from '@tanstack/react-table'
import {
  createRoleFn,
  deleteRoleFn,
  listRolesFn,
} from '#/lib/finance/finance.functions'
import { getErrorMessage } from '#/lib/finance/errors/error-message'
import { financeQueryKeys } from '#/lib/finance/queries/query-keys'
import type { Role } from '#/lib/finance/schemas'
import { defaultCreateRoleForm, type CreateRoleFormState } from './types'

function createDefaultRoleForm(): CreateRoleFormState {
  return { ...defaultCreateRoleForm }
}

interface RolesPageModelNotifications {
  onSuccess?: (message: string) => void
  onError?: (message: string) => void
}

interface DeleteRoleAction {
  onDelete: (id: number) => Promise<void>
  isPending: boolean
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

  return {
    form: create.form,
    setForm: create.setForm,
    onApply: create.onApply,
    rows: table.rows,
    rowsErrorMessage: table.rowsErrorMessage,
    isSubmitPending: create.isPending,
    remove,
  }
}
