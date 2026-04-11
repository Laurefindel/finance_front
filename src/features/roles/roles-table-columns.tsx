import type { ColumnDef } from '@tanstack/react-table'
import { ConfirmDialogButton } from '#/components/ui/confirm-dialog-button'
import type { Role } from '#/lib/finance/schemas'

interface CreateRolesTableColumnsOptions {
  isDeletePending: boolean
  onDelete: (id: number) => Promise<void>
}

export function createRolesTableColumns({
  isDeletePending,
  onDelete,
}: CreateRolesTableColumnsOptions): Array<ColumnDef<Role>> {
  return [
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
          <ConfirmDialogButton
            triggerLabel="Удалить"
            title={`Удалить роль #${id ?? '?'}`}
            description="Роль будет удалена из справочника. Проверьте, что она не назначена критичным пользователям."
            confirmLabel="Удалить"
            triggerVariant="outline"
            disabled={!id || isDeletePending}
            isPending={isDeletePending}
            onConfirm={async () => {
              if (!id) {
                return
              }

              await onDelete(id)
            }}
          />
        )
      },
    },
  ]
}
