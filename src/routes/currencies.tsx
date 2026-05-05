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
import { CurrenciesCreateCard } from '#/features/currencies/currencies-create-card'
import { createCurrenciesTableColumns } from '#/features/currencies/currencies-table-columns'
import { CurrenciesTableCard } from '#/features/currencies/currencies-table-card'
import { useCurrenciesPageModel } from '#/features/currencies/use-currencies-page-model'
import { PageHeaderSection } from '#/features/shared/page-header-section'

export const Route = createFileRoute('/currencies')({
  component: CurrenciesPage,
})

function CurrenciesPage() {
  const model = useCurrenciesPageModel({
    onSuccess: (message) => toast.success(message),
    onError: (message) => toast.error(message),
  })

  const columns = useMemo(
    () =>
      createCurrenciesTableColumns({
        isDeletePending: model.remove.isPending,
        isUpdatePending: model.update.isPending,
        onDelete: model.remove.onDelete,
        onUpdate: model.update.onUpdate,
      }),
    [
      model.remove.isPending,
      model.remove.onDelete,
      model.update.isPending,
      model.update.onUpdate,
    ],
  )

  return (
    <main className="page-wrap space-y-6 px-4 py-8">
      <PageHeaderSection
        kicker="Валюты"
        title="Валюты"
        description="Справочник валют: создание, обновление и удаление."
      />

      <CurrenciesTableCard
        columns={columns}
        data={model.table.rows}
        errorMessage={model.table.rowsErrorMessage}
        footerAction={
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">Создать валюту</Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Новая валюта</DialogTitle>
              </DialogHeader>
              <CurrenciesCreateCard
                value={model.create.form}
                onChange={model.create.setForm}
                onApply={model.create.onApply}
                isPending={model.create.isPending}
              />
            </DialogContent>
          </Dialog>
        }
      />
    </main>
  )
}
