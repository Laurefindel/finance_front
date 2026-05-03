import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '#/components/data/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import type { TableCardProps } from '#/features/shared/contracts'
import type { Role } from '#/lib/finance/schemas'

interface RolesTableCardProps
  extends Readonly<TableCardProps<Role>> {
  readonly columns: ColumnDef<Role>[]
}

export function RolesTableCard(
  props: Readonly<RolesTableCardProps>,
) {
  const { columns, data, errorMessage } = props

  return (
    <Card>
      <CardHeader>
        <CardTitle>Список ролей</CardTitle>
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