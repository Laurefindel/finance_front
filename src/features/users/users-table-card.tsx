import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '#/components/data/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Skeleton } from '#/components/ui/skeleton'
import type { TableCardProps } from '#/features/shared/contracts'
import type { UserTableRow } from './types'

interface UsersTableCardProps
  extends Readonly<TableCardProps<UserTableRow>> {
  readonly columns: ColumnDef<UserTableRow>[]
  readonly isInitialLoading: boolean
  readonly isFatalError: boolean
  readonly hasRefreshError: boolean
}

export function UsersTableCard(
  props: Readonly<UsersTableCardProps>,
) {
  const {
    columns,
    data,
    errorMessage,
    isInitialLoading,
    isFatalError,
    hasRefreshError,
  } = props

  if (isInitialLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Список пользователей</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isFatalError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Список пользователей</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{errorMessage}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Список пользователей</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {hasRefreshError ? (
            <p className="text-xs text-destructive">
              Не удалось обновить список с сервера: {errorMessage}
            </p>
          ) : null}

          <DataTable columns={columns} data={data} />
        </div>
      </CardContent>
    </Card>
  )
}