import type { ColumnDef } from '@tanstack/react-table'
import { ConfirmDialogButton } from '#/components/ui/confirm-dialog-button'
import type { CurrencyResponse } from '#/lib/finance/schemas'
import { CurrenciesUpdateDialogButton } from './currencies-update-dialog-button'

interface CreateCurrenciesTableColumnsOptions {
  isDeletePending: boolean
  isUpdatePending: boolean
  onDelete: (id: number) => Promise<void>
  onUpdate: (id: number, payload: { code: string; name: string }) => Promise<void>
}

export function createCurrenciesTableColumns({
  isDeletePending,
  isUpdatePending,
  onDelete,
  onUpdate,
}: CreateCurrenciesTableColumnsOptions): Array<ColumnDef<CurrencyResponse>> {
  return [
    {
      accessorKey: 'code',
      header: 'Код',
    },
    {
      accessorKey: 'name',
      header: 'Название',
    },
    {
      id: 'actions',
      header: <div className="text-right">Действия</div>,
      cell: ({ row }) => {
        const id = row.original.id

        return (
          <div className="flex items-center justify-end gap-2">
            <CurrenciesUpdateDialogButton
              currency={row.original}
              isPending={isUpdatePending}
              onUpdate={onUpdate}
            />
            <ConfirmDialogButton
              triggerLabel="Удалить"
              title="Удалить валюту?"
              description="Валюта будет удалена из справочника. Убедитесь, что она не используется в активных сценариях."
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
