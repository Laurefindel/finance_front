import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '#/components/ui/badge'
import { ConfirmDialogButton } from '#/components/ui/confirm-dialog-button'
import { UsersAccountsHover } from './users-accounts-hover'
import type { UserTableRow } from './types'
import { UsersUpdateDialogButton } from './users-update-dialog-button'

interface CreateUsersTableColumnsOptions {
  isDeletePending: boolean
  isUpdatePending: boolean
  onDelete: (id: number) => Promise<void>
  onUpdate: (
    id: number,
    payload: {
      firstName: string
      lastName: string
      email: string
      password: string
    },
  ) => Promise<void>
}

export function createUsersTableColumns({
  isDeletePending,
  isUpdatePending,
  onDelete,
  onUpdate,
}: CreateUsersTableColumnsOptions): Array<ColumnDef<UserTableRow>> {
  return [
    {
      accessorKey: 'firstName',
      header: 'Имя',
      cell: ({ row }) => (
        <UsersAccountsHover
          user={row.original}
          triggerLabel={row.original.firstName ?? '-'}
          accountsSummary={row.original.accountsSummary}
        />
      ),
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
      cell: ({ row }) => {
        const total =
          row.original.accountsSummary.length ||
          row.original.accountsIds?.length ||
          0

        return (
          <UsersAccountsHover
            user={row.original}
            triggerLabel={String(total)}
            accountsSummary={row.original.accountsSummary}
          />
        )
      },
    },
    {
      id: 'actions',
      header: <div className="text-right">Действия</div>,
      cell: ({ row }) => {
        const id = row.original.id

        return (
          <div className="flex items-center justify-end gap-2">
            <UsersUpdateDialogButton
              user={row.original}
              isPending={isUpdatePending}
              onUpdate={onUpdate}
            />

            <ConfirmDialogButton
              triggerLabel="Удалить"
              title="Удалить пользователя?"
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
          </div>
        )
      },
    },
  ]
}
