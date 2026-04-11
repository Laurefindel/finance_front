import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '#/components/data/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import type { TableCardProps } from '#/features/shared/contracts'
import type { CurrencyResponse } from '#/lib/finance/schemas'

interface CurrenciesTableCardProps extends TableCardProps<CurrencyResponse> {
  columns: Array<ColumnDef<CurrencyResponse>>
}

export function CurrenciesTableCard({
  columns,
  data,
  errorMessage,
}: CurrenciesTableCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Список валют</CardTitle>
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
