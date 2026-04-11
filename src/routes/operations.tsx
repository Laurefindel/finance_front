import { createFileRoute } from '@tanstack/react-router'
import { OperationsBulkCard } from '#/features/operations/operations-bulk-card'
import { OperationsCreateCard } from '#/features/operations/operations-create-card'
import { OperationsFiltersCard } from '#/features/operations/operations-filters-card'
import { OperationsTableCard } from '#/features/operations/operations-table-card'
import { useOperationsPageModel } from '#/features/operations/use-operations-page-model'
import { PageHeaderSection } from '#/features/shared/page-header-section'

export const Route = createFileRoute('/operations')({
  component: OperationsPage,
})

function OperationsPage() {
  const model = useOperationsPageModel()

  return (
    <main className="page-wrap space-y-6 px-4 py-8">
      <PageHeaderSection
        kicker="Operations"
        title="Операции"
        description="Поиск, создание, удаление и bulk-операции."
      />

      <OperationsFiltersCard
        value={model.filters.form}
        onChange={model.filters.setForm}
        onApply={model.filters.onApply}
        onReset={model.filters.onReset}
      />

      <OperationsCreateCard
        value={model.create.form}
        onChange={model.create.setForm}
        onApply={model.create.onApply}
        isPending={model.create.isPending}
      />

      <OperationsBulkCard
        value={model.bulk.payload}
        onChange={model.bulk.setPayload}
        onApplyTransactional={model.bulk.transactional.onApply}
        onApplyNonTransactional={model.bulk.nonTransactional.onApply}
        isTransactionalPending={model.bulk.transactional.isPending}
        isNonTransactionalPending={model.bulk.nonTransactional.isPending}
      />

      <OperationsTableCard
        columns={model.table.columns}
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
