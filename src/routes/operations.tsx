import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { OperationsBulkCard } from '#/features/operations/operations-bulk-card'
import { OperationsCreateCard } from '#/features/operations/operations-create-card'
import { OperationsFiltersCard } from '#/features/operations/operations-filters-card'
import { createOperationsTableColumns } from '#/features/operations/operations-table-columns'
import { OperationsTableCard } from '#/features/operations/operations-table-card'
import { useOperationsPageModel } from '#/features/operations/use-operations-page-model'
import { PageHeaderSection } from '#/features/shared/page-header-section'

export const Route = createFileRoute('/operations')({
  component: OperationsPage,
})

function OperationsPage() {
  const model = useOperationsPageModel({
    onSuccess: (message) => toast.success(message),
    onError: (message) => toast.error(message),
  })

  const columns = useMemo(
    () =>
      createOperationsTableColumns({
        isDeletePending: model.remove.isPending,
        onDelete: model.remove.onDelete,
        getPartyDetails: model.table.getPartyDetails,
      }),
    [
      model.remove.isPending,
      model.remove.onDelete,
      model.table.getPartyDetails,
    ],
  )

  return (
    <main className="page-wrap space-y-6 px-4 py-8">
      <PageHeaderSection
        kicker="Операции"
        title="Операции"
        description="Поиск, создание, удаление и bulk-операции."
      />

      <div className="flex flex-wrap gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Создать операцию</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Новая операция</DialogTitle>
            </DialogHeader>
            <OperationsCreateCard
              value={model.create.form}
              onChange={model.create.setForm}
              onApply={model.create.onApply}
              isPending={model.create.isPending}
              accounts={model.lookups.accounts}
            />
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Массовое создание</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Массовое создание операций</DialogTitle>
            </DialogHeader>
            <OperationsBulkCard
              value={model.bulk.payload}
              onChange={model.bulk.setPayload}
              onApplyTransactional={model.bulk.transactional.onApply}
              onApplyNonTransactional={model.bulk.nonTransactional.onApply}
              isTransactionalPending={model.bulk.transactional.isPending}
              isNonTransactionalPending={model.bulk.nonTransactional.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <OperationsFiltersCard
        value={model.filters.form}
        onChange={model.filters.setForm}
        onApply={model.filters.onApply}
        onReset={model.filters.onReset}
        users={model.lookups.users}
      />

      <OperationsTableCard
        columns={columns}
        data={model.table.rows}
        errorMessage={model.table.rowsErrorMessage}
        currentPage={model.table.pagination.currentPage}
        totalPages={model.table.pagination.totalPages}
        canPrev={model.table.pagination.canPrev}
        canNext={model.table.pagination.canNext}
        onPrev={model.table.pagination.onPrev}
        onNext={model.table.pagination.onNext}
      />
    </main>
  )
}
