import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '#/components/data/data-table'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import type { TableCardProps } from '#/features/shared/contracts'
import type { FinancialOperationResponse } from '#/lib/finance/schemas'

interface OperationsTableCardProps
  extends TableCardProps<FinancialOperationResponse> {
  columns: Array<ColumnDef<FinancialOperationResponse>>
  currentPage: number
  totalPages: number
  canPrev: boolean
  canNext: boolean
  onPrev: () => void
  onNext: () => void
}

export function OperationsTableCard({
  columns,
  data,
  errorMessage,
  currentPage,
  totalPages,
  canPrev,
  canNext,
  onPrev,
  onNext,
}: OperationsTableCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Список операций</CardTitle>
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

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Страница {currentPage} из {totalPages}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" disabled={!canPrev} onClick={onPrev}>
              Назад
            </Button>
            <Button variant="outline" disabled={!canNext} onClick={onNext}>
              Вперед
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
