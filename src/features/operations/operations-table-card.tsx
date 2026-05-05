import type { ReactNode } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '#/components/data/data-table'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import type { TableCardProps } from '#/features/shared/contracts'
import type { FinancialOperationResponse } from '#/lib/finance/schemas'

interface OperationsTableCardProps
  extends Readonly<TableCardProps<FinancialOperationResponse>> {
  readonly columns: ColumnDef<FinancialOperationResponse>[]
  readonly currentPage: number
  readonly totalPages: number
  readonly canPrev: boolean
  readonly canNext: boolean
  readonly onPrev: () => void
  readonly onNext: () => void
  readonly headerAction?: ReactNode
  readonly footerAction?: ReactNode
}

export function OperationsTableCard(
  props: Readonly<OperationsTableCardProps>,
) {
  const {
    columns,
    data,
    errorMessage,
    currentPage,
    totalPages,
    canPrev,
    canNext,
    onPrev,
    onNext,
    headerAction,
    footerAction,
  } = props

  return (
    <Card>
      <CardHeader>
        <CardTitle>Список операций</CardTitle>
        {headerAction ? <CardAction>{headerAction}</CardAction> : null}
      </CardHeader>

      <CardContent className="space-y-4">
        {errorMessage ? (
          <p className="text-sm text-destructive">{errorMessage}</p>
        ) : (
          <DataTable
            columns={columns}
            data={data}
            emptyMessage="Операции не найдены"
          />
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Button variant="outline" disabled={!canPrev} onClick={onPrev}>
            Назад
          </Button>
          <Button variant="outline" disabled={!canNext} onClick={onNext}>
            Вперед
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            Страница {currentPage} из {totalPages}
          </p>
          {footerAction}
        </div>
      </CardFooter>
    </Card>
  )
}