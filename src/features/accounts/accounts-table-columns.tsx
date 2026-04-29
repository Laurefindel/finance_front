import type { ColumnDef } from '@tanstack/react-table'
import { ConfirmDialogButton } from '#/components/ui/confirm-dialog-button'
import type { AccountResponse } from '#/lib/finance/schemas'
import { AccountsCurrencyHover } from './accounts-currency-hover'
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
      cell: ({ row }) => <AccountsCurrencyHover currency={row.original.currency} />,
    },
    {
      id: 'incoming',
      header: 'Входящие',
      cell: ({ row }) => {
        const incoming = row.original.incomingOperations ?? []
        return (
          <AccountsOperationsHover
            triggerLabel={String(incoming.length)}
            title="Входящие операции"
            items={incoming}
            emptyText="Входящих операций пока нет"
            ariaLabel="Показать входящие операции"
          />
        )
      },
    },
    {
      id: 'outcoming',
      header: 'Исходящие',
      cell: ({ row }) => {
        const outcoming = row.original.outcomingOperations ?? []
        return (
          <AccountsOperationsHover
            triggerLabel={String(outcoming.length)}
            title="Исходящие операции"
            items={outcoming}
            emptyText="Исходящих операций пока нет"
            ariaLabel="Показать исходящие операции"
          />
        )
      },
    },
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }) => {
        const id = row.original.id

        return (
          <ConfirmDialogButton
            triggerLabel="Удалить"
            title="Удалить счет?"
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
