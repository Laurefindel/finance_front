import type { ColumnDef } from '@tanstack/react-table'
import { ConfirmDialogButton } from '#/components/ui/confirm-dialog-button'
import type {
  AccountResponse,
  FinancialOperationResponse,
  UserResponse,
} from '#/lib/finance/schemas'
import { OperationsPartyHover } from './operations-party-hover'

interface CreateOperationsTableColumnsOptions {
  isDeletePending: boolean
  onDelete: (id: number) => Promise<void>
  getPartyDetails: (accountId: number | undefined) => {
    account?: AccountResponse
    user?: UserResponse
  }
}

export function createOperationsTableColumns({
  isDeletePending,
  onDelete,
  getPartyDetails,
}: CreateOperationsTableColumnsOptions): Array<ColumnDef<FinancialOperationResponse>> {
  return [
    {
      accessorKey: 'senderAccountId',
      header: 'Отправитель',
      cell: ({ row }) => {
        const accountId = row.original.senderAccountId
        const details = getPartyDetails(accountId)

        return (
          <OperationsPartyHover
            accountId={accountId}
            account={details.account}
            user={details.user}
            label="Отправитель"
          />
        )
      },
    },
    {
      accessorKey: 'receiverAccountId',
      header: 'Получатель',
      cell: ({ row }) => {
        const accountId = row.original.receiverAccountId
        const details = getPartyDetails(accountId)

        return (
          <OperationsPartyHover
            accountId={accountId}
            account={details.account}
            user={details.user}
            label="Получатель"
          />
        )
      },
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
            title="Удалить операцию?"
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
