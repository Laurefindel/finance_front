import type { ColumnDef } from '@tanstack/react-table'
import { ConfirmDialogButton } from '#/components/ui/confirm-dialog-button'
import type { AccountResponse } from '#/lib/finance/schemas'
import { AccountsOperationsHover } from './accounts-operations-hover'

interface AccountsTableColumnsOptions {
  isDeletePending: boolean
  onDelete: (id: number) => Promise<void>
}

export function createAccountsTableColumns({
  isDeletePending,
  onDelete,
}: AccountsTableColumnsOptions): Array<ColumnDef<AccountResponse>> {
  return [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <AccountsOperationsHover
          accountId={row.original.id}
          incomingOperations={row.original.incomingOperations ?? []}
          outcomingOperations={row.original.outcomingOperations ?? []}
        />
      ),
    },
    {
      accessorKey: 'balance',
      header: 'Баланс',
      cell: ({ row }) => {
        const value = row.original.balance
        return value === undefined ? '-' : Number(value).toFixed(2)
      },
    },
    {
      id: 'owner',
      header: 'Владелец',
      cell: ({ row }) => {
        const user = row.original.user
        if (!user) {
          return '-'
        }

        return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || '-'
      },
    },
    {
      id: 'currency',
      header: 'Валюта',
      cell: ({ row }) => row.original.currency?.code ?? '-',
    },
    {
      id: 'incoming',
      header: 'Входящие',
      cell: ({ row }) => row.original.incomingOperations?.length ?? 0,
    },
    {
      id: 'outcoming',
      header: 'Исходящие',
      cell: ({ row }) => row.original.outcomingOperations?.length ?? 0,
    },
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }) => {
        const id = row.original.id

        return (
          <ConfirmDialogButton
            triggerLabel="Удалить"
            title={`Удалить счет #${id ?? '?'}`}
            description="Действие необратимо. Счет и связанные данные нельзя будет восстановить автоматически."
            confirmLabel="Удалить"
            disabled={!id || isDeletePending}
            isPending={isDeletePending}
            onConfirm={async () => {
              if (!id) {
                return
              }

              try {
                await onDelete(id)
              } catch {
                // Mutation error is handled in the page model notifications.
              }
            }}
          />
        )
      },
    },
  ]
}
