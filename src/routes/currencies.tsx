import { createFileRoute } from '@tanstack/react-router'
import { CurrenciesCreateCard } from '#/features/currencies/currencies-create-card'
import { CurrenciesTableCard } from '#/features/currencies/currencies-table-card'
import { CurrenciesUpdateCard } from '#/features/currencies/currencies-update-card'
import { useCurrenciesPageModel } from '#/features/currencies/use-currencies-page-model'
import { PageHeaderSection } from '#/features/shared/page-header-section'

export const Route = createFileRoute('/currencies')({
  component: CurrenciesPage,
})

function CurrenciesPage() {
  const model = useCurrenciesPageModel()

  return (
    <main className="page-wrap space-y-6 px-4 py-8">
      <PageHeaderSection
        kicker="Currencies"
        title="Валюты"
        description="Справочник валют: создание, обновление и удаление."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <CurrenciesCreateCard
          value={model.create.form}
          onChange={model.create.setForm}
          onApply={model.create.onApply}
          isPending={model.create.isPending}
        />

        <CurrenciesUpdateCard
          value={model.update.form}
          onChange={model.update.setForm}
          onApply={model.update.onApply}
          isPending={model.update.isPending}
        />
      </div>

      <CurrenciesTableCard
        columns={model.table.columns}
        data={model.table.rows}
        errorMessage={model.table.rowsErrorMessage}
      />
    </main>
  )
}
