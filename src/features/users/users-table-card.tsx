import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '#/components/data/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Skeleton } from '#/components/ui/skeleton'
import type { TableCardProps } from '#/features/shared/contracts'
import type { UserTableRow } from './types'

interface UsersTableCardProps extends TableCardProps<UserTableRow> {
  columns: Array<ColumnDef<UserTableRow>>
  isInitialLoading: boolean
  isFatalError: boolean
  hasRefreshError: boolean
}

export function UsersTableCard({
  columns,
  data,
  errorMessage,
  isInitialLoading,
  isFatalError,
  hasRefreshError,
}: UsersTableCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Список пользователей</CardTitle>
      </CardHeader>
      <CardContent>
        {isInitialLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : isFatalError ? (
          <p className="text-sm text-destructive">{errorMessage}</p>
        ) : (
          <div className="space-y-3">
            {hasRefreshError ? (
              <p className="text-xs text-destructive">
                Не удалось обновить список с сервера: {errorMessage}
              </p>
            ) : null}
            <DataTable columns={columns} data={data} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
