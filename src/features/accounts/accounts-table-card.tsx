import type { ReactNode } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '#/components/data/data-table'
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import type { TableCardProps } from '#/features/shared/contracts'
import type { AccountResponse } from '#/lib/finance/schemas'

interface AccountsTableCardProps
  extends Readonly<TableCardProps<AccountResponse>> {
  readonly columns: ColumnDef<AccountResponse>[] 
  readonly headerAction?: ReactNode
  readonly footerAction?: ReactNode
}

export function AccountsTableCard(
  props: Readonly<AccountsTableCardProps>,
) {
  const { columns, data, errorMessage, headerAction, footerAction } = props

  return (
    <Card>
      <CardHeader>
        <CardTitle>Список счетов</CardTitle>
        {headerAction ? <CardAction>{headerAction}</CardAction> : null}
      </CardHeader>
      <CardContent>
        {errorMessage ? (
          <p className="text-sm text-destructive">{errorMessage}</p>
        ) : (
          <DataTable columns={columns} data={data} />
        )}
      </CardContent>
      {footerAction ? (
        <CardFooter className="justify-end">{footerAction}</CardFooter>
      ) : null}
    </Card>
  )
}