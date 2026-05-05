import type { ColumnDef } from '@tanstack/react-table'
import { ConfirmDialogButton } from '#/components/ui/confirm-dialog-button'
import type { AccountResponse } from '#/lib/finance/schemas'
import { AccountsCurrencyHover } from './accounts-currency-hover'
import { AccountsOwnerHover } from './accounts-owner-hover'
import { AccountsOperationsHover } from './accounts-operations-hover'
import { AccountsReplenishMenu } from './accounts-replenish-menu'

interface AccountsTableColumnsOptions {
  isDeletePending: boolean
  onDelete: (id: number) => Promise<void>
  onOpenReplenish: (accountId: number) => void
  onOpenAsync: (accountId: number) => void
}

export function createAccountsTableColumns({
  isDeletePending,
  onDelete,
  onOpenReplenish,
  onOpenAsync,
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
        return <AccountsOwnerHover user={row.original.user} />
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
      header: <div className="text-right">Действия</div>,
      cell: ({ row }) => {
        const id = row.original.id

        return (
          <div className="flex items-center justify-end gap-2">
            <AccountsReplenishMenu
              account={row.original}
              onOpenReplenish={onOpenReplenish}
              onOpenAsync={onOpenAsync}
            />
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
          </div>
        )
      },
    },
  ]
}
