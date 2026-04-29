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
import { AccountsCreateCard } from '#/features/accounts/accounts-create-card'
import { AccountsFiltersCard } from '#/features/accounts/accounts-filters-card'
import { AccountsReplenishCard } from '#/features/accounts/accounts-replenish-card'
import { AccountsTableCard } from '#/features/accounts/accounts-table-card'
import { createAccountsTableColumns } from '#/features/accounts/accounts-table-columns'
import { useAccountsPageModel } from '#/features/accounts/use-accounts-page-model'
import { AsyncReplenishMetricsCard } from '#/features/async-replenish/async-replenish-metrics-card'
import { AsyncReplenishStartCard } from '#/features/async-replenish/async-replenish-start-card'
import { AsyncReplenishStatusCard } from '#/features/async-replenish/async-replenish-status-card'
import {
  showAsyncStartedToast,
  showAsyncStartFailedToast,
  showAsyncStartSubmittingToast,
  useAsyncReplenishToastSync,
} from '#/features/async-replenish/use-async-replenish-toast'
import { useAsyncReplenishPageModel } from '#/features/async-replenish/use-async-replenish-page-model'
import { PageHeaderSection } from '#/features/shared/page-header-section'

export function AccountsPageContent() {
  const model = useAccountsPageModel({
    onSuccess: (message) => toast.success(message),
    onError: (message) => toast.error(message),
  })
  const asyncModel = useAsyncReplenishPageModel({
    onValidationError: (message) => toast.error(message),
    onStartSubmitting: (metrics) => showAsyncStartSubmittingToast(metrics),
    onStartSuccess: (taskId, metrics) => showAsyncStartedToast(taskId, metrics),
    onStartError: (message, metrics) =>
      showAsyncStartFailedToast(message, metrics),
  })

  useAsyncReplenishToastSync(asyncModel.toastSync)

  const columns = useMemo(
    () =>
      createAccountsTableColumns({
        isDeletePending: model.delete.isPending,
        onDelete: model.delete.onDelete,
      }),
    [model.delete.isPending, model.delete.onDelete],
  )

  return (
    <main className="page-wrap space-y-6 px-4 py-8">
      <PageHeaderSection
        kicker="Счета"
        title="Счета"
        description="Создание, фильтрация, синхронное и асинхронное пополнение, удаление счетов."
      />

      <div className="flex flex-wrap gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Создать счет</Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Новый счет</DialogTitle>
            </DialogHeader>
            <AccountsCreateCard
              value={model.create.form}
              onChange={model.create.setForm}
              onApply={model.create.onApply}
              isPending={model.create.isPending}
              users={model.lookups.users}
              currencies={model.lookups.currencies}
            />
          </DialogContent>
        </Dialog>
      </div>

      <AccountsReplenishCard
        value={model.replenish.form}
        onChange={model.replenish.setForm}
        onApply={model.replenish.onApply}
        isPending={model.replenish.isPending}
        accounts={model.lookups.accounts}
      />

      <section className="space-y-4">
        <p className="island-kicker">Асинхронное пополнение</p>
        <h2 className="text-xl font-semibold text-(--sea-ink)">Асинхронное пополнение</h2>

        <AsyncReplenishStartCard
          value={asyncModel.form}
          onChange={asyncModel.setForm}
          onApply={asyncModel.onApply}
          isPending={asyncModel.isSubmitPending}
          accounts={model.lookups.accounts}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <AsyncReplenishStatusCard
            taskId={asyncModel.taskId}
            status={asyncModel.status}
            message={asyncModel.statusMessage}
            statusTone={asyncModel.statusTone}
          />

          <AsyncReplenishMetricsCard
            submitted={asyncModel.submitted}
            running={asyncModel.running}
            succeeded={asyncModel.succeeded}
            failed={asyncModel.failed}
            errorMessage={asyncModel.metricsErrorMessage}
          />
        </div>
      </section>

      <AccountsFiltersCard
        value={model.filters.form}
        onChange={model.filters.setForm}
        onReset={model.filters.onReset}
        users={model.lookups.users}
        currencies={model.lookups.currencies}
      />

      <AccountsTableCard
        columns={columns}
        data={model.rows}
        errorMessage={model.rowsErrorMessage}
      />
    </main>
  )
}
