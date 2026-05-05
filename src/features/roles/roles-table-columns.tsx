import type { ColumnDef } from '@tanstack/react-table'
import { ConfirmDialogButton } from '#/components/ui/confirm-dialog-button'
import type { Role, UserResponse } from '#/lib/finance/schemas'
import { RolesUsersDialogButton } from './roles-users-dialog-button'

interface CreateRolesTableColumnsOptions {
  isDeletePending: boolean
  isAssignPending: boolean
  isRemovePending: boolean
  onDelete: (id: number) => Promise<void>
  onAssign: (userId: number, roleId: number) => Promise<void>
  onRemove: (userId: number, roleId: number) => Promise<void>
  users: UserResponse[]
}

export function createRolesTableColumns({
  isDeletePending,
  isAssignPending,
  isRemovePending,
  onDelete,
  onAssign,
  onRemove,
  users,
}: CreateRolesTableColumnsOptions): Array<ColumnDef<Role>> {
  return [
    {
      accessorKey: 'name',
      header: 'Название роли',
    },
    {
      id: 'actions',
      header: <div className="text-right">Действия</div>,
      cell: ({ row }) => {
        const id = row.original.id

        return (
          <div className="flex items-center justify-end gap-2">
            <RolesUsersDialogButton
              role={row.original}
              users={users}
              onAssign={onAssign}
              onRemove={onRemove}
              isAssignPending={isAssignPending}
              isRemovePending={isRemovePending}
            />
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
