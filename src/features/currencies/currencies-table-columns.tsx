import type { ColumnDef } from '@tanstack/react-table'
import { ConfirmDialogButton } from '#/components/ui/confirm-dialog-button'
import type { CurrencyResponse } from '#/lib/finance/schemas'

interface CreateCurrenciesTableColumnsOptions {
  isDeletePending: boolean
  onDelete: (id: number) => Promise<void>
}

export function createCurrenciesTableColumns({
  isDeletePending,
  onDelete,
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
      header: 'Действия',
      cell: ({ row }) => {
        const id = row.original.id

        return (
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
        )
      },
    },
  ]
}
