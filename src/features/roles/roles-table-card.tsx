import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '#/components/data/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import type { TableCardProps } from '#/features/shared/contracts'
import type { Role } from '#/lib/finance/schemas'

interface RolesTableCardProps extends TableCardProps<Role> {
  columns: Array<ColumnDef<Role>>
}

export function RolesTableCard({
  columns,
  data,
  errorMessage,
}: RolesTableCardProps) {
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
