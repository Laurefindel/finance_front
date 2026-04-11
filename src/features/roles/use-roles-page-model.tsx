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
  createRoleFn,
  deleteRoleFn,
  listRolesFn,
} from '#/lib/finance/finance.functions'
import { getErrorMessage } from '#/lib/finance/error-utils'
import { financeQueryKeys } from '#/lib/finance/query-keys'
import type { Role } from '#/lib/finance/schemas'
import { defaultCreateRoleForm, type CreateRoleFormState } from './types'

function createDefaultRoleForm(): CreateRoleFormState {
  return { ...defaultCreateRoleForm }
}

export function useRolesPageModel() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<CreateRoleFormState>(createDefaultRoleForm)

  const rolesQuery = useQuery({
    queryKey: financeQueryKeys.roles,
    queryFn: () => listRolesFn(),
  })

  const createRoleMutation = useMutation({
    mutationFn: (payload: { name: string }) => createRoleFn({ data: payload }),
    onSuccess: async () => {
      toast.success('Роль создана')
      setForm(createDefaultRoleForm())
      await queryClient.invalidateQueries({ queryKey: financeQueryKeys.roles })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  const deleteRoleMutation = useMutation({
    mutationFn: (id: number) => deleteRoleFn({ data: { id } }),
    onSuccess: async () => {
      toast.success('Роль удалена')
      await queryClient.invalidateQueries({ queryKey: financeQueryKeys.roles })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  const columns = useMemo<Array<ColumnDef<Role>>>(
    () => [
      {
        accessorKey: 'name',
        header: 'Название роли',
      },
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => row.original.id ?? '-',
      },
      {
        id: 'actions',
        header: 'Действия',
        cell: ({ row }) => {
          const id = row.original.id

          return (
            <Button
              variant="outline"
              size="sm"
              disabled={!id || deleteRoleMutation.isPending}
              onClick={() => {
                if (!id) {
                  toast.info('У роли отсутствует ID в ответе API')
                  return
                }

                if (window.confirm(`Удалить роль #${id}?`)) {
                  deleteRoleMutation.mutate(id)
                }
              }}
            >
              Удалить
            </Button>
          )
        },
      },
    ],
    [deleteRoleMutation],
  )

  const onApply = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      await createRoleMutation.mutateAsync({ name: form.name.trim() })
    } catch {
      // onError already shows a toast; swallow to avoid unhandled promise in console.
    }
  }

  const create: FormActionModel<CreateRoleFormState> = {
    form,
    setForm,
    onApply,
    isPending: createRoleMutation.isPending,
  }

  const table: TableViewModel<Role> = {
    columns,
    rows: rolesQuery.data ?? [],
    rowsErrorMessage: rolesQuery.error ? getErrorMessage(rolesQuery.error) : null,
  }

  return {
    form: create.form,
    setForm: create.setForm,
    onApply: create.onApply,
    columns: table.columns,
    rows: table.rows,
    rowsErrorMessage: table.rowsErrorMessage,
    isSubmitPending: create.isPending,
  }
}
