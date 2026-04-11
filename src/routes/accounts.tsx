import { createFileRoute } from '@tanstack/react-router'
import { AccountsCreateCard } from '#/features/accounts/accounts-create-card'
import { AccountsFiltersCard } from '#/features/accounts/accounts-filters-card'
import { AccountsReplenishCard } from '#/features/accounts/accounts-replenish-card'
import { AccountsTableCard } from '#/features/accounts/accounts-table-card'
import { useAccountsPageModel } from '#/features/accounts/use-accounts-page-model'
import { PageHeaderSection } from '#/features/shared/page-header-section'

export const Route = createFileRoute('/accounts')({
  component: AccountsPage,
})

function AccountsPage() {
  const model = useAccountsPageModel()

  return (
    <main className="page-wrap space-y-6 px-4 py-8">
      <PageHeaderSection
        kicker="Accounts"
        title="Счета"
        description="Создание, фильтрация, пополнение и удаление счетов."
      />

      <AccountsFiltersCard
        value={model.filters.form}
        onChange={model.filters.setForm}
        onReset={model.filters.onReset}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <AccountsCreateCard
          value={model.create.form}
          onChange={model.create.setForm}
          onApply={model.create.onApply}
          isPending={model.create.isPending}
        />

        <AccountsReplenishCard
          value={model.replenish.form}
          onChange={model.replenish.setForm}
          onApply={model.replenish.onApply}
          isPending={model.replenish.isPending}
        />
      </div>

      <AccountsTableCard
        columns={model.table.columns}
        data={model.table.rows}
        errorMessage={model.table.rowsErrorMessage}
      />
    </main>
  )
}
