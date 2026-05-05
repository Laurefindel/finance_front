import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#/components/ui/sheet'
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
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isBulkOpen, setIsBulkOpen] = useState(false)

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
        headerAction={
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                Фильтры
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle>Фильтры операций</SheetTitle>
              </SheetHeader>
              <div className="p-4">
                <OperationsFiltersCard
                  value={model.filters.form}
                  onChange={model.filters.setForm}
                  onApply={model.filters.onApply}
                  onReset={model.filters.onReset}
                  users={model.lookups.users}
                />
              </div>
            </SheetContent>
          </Sheet>
        }
        footerAction={
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm">Создать</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setIsCreateOpen(true)}>
                  Одна операция
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setIsBulkOpen(true)}>
                  Массовая операция
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
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

            <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
              <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Массовое создание операций</DialogTitle>
                </DialogHeader>
                <OperationsBulkCard
                  value={model.bulk.form}
                  onChange={model.bulk.setForm}
                  onApply={model.bulk.action.onApply}
                  isPending={model.bulk.action.isPending}
                  accounts={model.lookups.accounts}
                  users={model.lookups.users}
                />
              </DialogContent>
            </Dialog>
          </div>
        }
      />
    </main>
  )
}
