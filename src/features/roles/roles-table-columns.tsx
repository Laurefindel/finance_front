import type { ColumnDef } from '@tanstack/react-table'
import { ConfirmDialogButton } from '#/components/ui/confirm-dialog-button'
import type { Role } from '#/lib/finance/schemas'

interface CreateRolesTableColumnsOptions {
  isDeletePending: boolean
  onDelete: (name: string) => Promise<void>
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
      id: 'actions',
      header: 'Действия',
      cell: ({ row }) => {
        const name = row.original.name?.trim()

        return (
          <ConfirmDialogButton
            triggerLabel="Удалить"
            title="Удалить роль?"
            description="Роль будет удалена из справочника. Проверьте, что она не назначена критичным пользователям."
            confirmLabel="Удалить"
            triggerVariant="outline"
            disabled={!name || isDeletePending}
            isPending={isDeletePending}
            onConfirm={async () => {
              if (!name) {
                return
              }

              await onDelete(name)
            }}
          />
        )
      },
    },
  ]
}
