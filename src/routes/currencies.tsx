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
import { CurrenciesUpdateCard } from '#/features/currencies/currencies-update-card'
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
        onDelete: model.remove.onDelete,
      }),
    [model.remove.isPending, model.remove.onDelete],
  )

  return (
    <main className="page-wrap space-y-6 px-4 py-8">
      <PageHeaderSection
        kicker="Валюты"
        title="Валюты"
        description="Справочник валют: создание, обновление и удаление."
      />

      <div className="flex flex-wrap gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Создать валюту</Button>
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

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Редактировать валюту</Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Редактирование валюты</DialogTitle>
            </DialogHeader>
            <CurrenciesUpdateCard
              value={model.update.form}
              onChange={model.update.setForm}
              onApply={model.update.onApply}
              isPending={model.update.isPending}
              currencies={model.table.rows}
            />
          </DialogContent>
        </Dialog>
      </div>

      <CurrenciesTableCard
        columns={columns}
        data={model.table.rows}
        errorMessage={model.table.rowsErrorMessage}
      />
    </main>
  )
}
