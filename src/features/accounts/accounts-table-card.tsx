import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '#/components/data/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import type { TableCardProps } from '#/features/shared/contracts'
import type { AccountResponse } from '#/lib/finance/schemas'

interface AccountsTableCardProps
  extends Readonly<TableCardProps<AccountResponse>> {
  readonly columns: ColumnDef<AccountResponse>[] 
}

export function AccountsTableCard(
  props: Readonly<AccountsTableCardProps>,
) {
  const { columns, data, errorMessage } = props

  return (
    <Card>
      <CardHeader>
        <CardTitle>Список счетов</CardTitle>
      </CardHeader>
      <CardContent>
        {errorMessage ? (
          <p className="text-sm text-destructive">{errorMessage}</p>
        ) : (
          <DataTable columns={columns} data={data} />
        )}
      </CardContent>
    </Card>
  )
}