import type { ColumnDef } from '@tanstack/react-table'
import { ConfirmDialogButton } from '#/components/ui/confirm-dialog-button'
import type { FinancialOperationResponse } from '#/lib/finance/schemas'

interface CreateOperationsTableColumnsOptions {
  isDeletePending: boolean
  onDelete: (id: number) => Promise<void>
}

export function createOperationsTableColumns({
  isDeletePending,
  onDelete,
}: CreateOperationsTableColumnsOptions): Array<ColumnDef<FinancialOperationResponse>> {
  return [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'senderAccountId',
      header: 'Отправитель',
    },
    {
      accessorKey: 'receiverAccountId',
      header: 'Получатель',
    },
    {
      accessorKey: 'amount',
      header: 'Сумма',
    },
    {
      accessorKey: 'currencyCode',
      header: 'Валюта',
      cell: ({ row }) => row.original.currencyCode ?? '-',
    },
    {
      accessorKey: 'description',
      header: 'Описание',
      cell: ({ row }) => row.original.description ?? '-',
    },
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }) => {
        const id = row.original.id

        return (
          <ConfirmDialogButton
            triggerLabel="Удалить"
            title={`Удалить операцию #${id ?? '?'}`}
            description="Операция будет удалена из списка. Продолжить?"
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
