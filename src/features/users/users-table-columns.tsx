import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '#/components/ui/badge'
import { ConfirmDialogButton } from '#/components/ui/confirm-dialog-button'
import type { UserResponse } from '#/lib/finance/schemas'

interface CreateUsersTableColumnsOptions {
  isDeletePending: boolean
  onDelete: (id: number) => Promise<void>
}

export function createUsersTableColumns({
  isDeletePending,
  onDelete,
}: CreateUsersTableColumnsOptions): Array<ColumnDef<UserResponse>> {
  return [
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
          <ConfirmDialogButton
            triggerLabel="Удалить"
            title={`Удалить пользователя #${id ?? '?'}`}
            description="Пользователь будет удален. Убедитесь, что это не нарушит связанные бизнес-процессы."
            confirmLabel="Удалить"
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
