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
      id: 'actions',
      header: () => <div className="text-right">Действия</div>,
      cell: ({ row }) => {
        const id = row.original.id

        return (
          <div className="flex items-center justify-end gap-2">
            <ConfirmDialogButton
              triggerLabel="Удалить"
              title="Удалить роль?"
              description="Роль будет удалена из справочника. Проверьте, что она не назначена критичным пользователям."
              confirmLabel="Удалить"
              triggerVariant="destructive"
              disabled={!id || isDeletePending}
              isPending={isDeletePending}
              onConfirm={async () => {
                if (!id) {
                  return
                }

                await onDelete(id)
              }}
            />
          </div>
        )
      },
    },
  ]
}
