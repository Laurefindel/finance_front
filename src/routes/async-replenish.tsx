import { createFileRoute } from '@tanstack/react-router'
import { AsyncReplenishMetricsCard } from '#/features/async-replenish/async-replenish-metrics-card'
import { AsyncReplenishStartCard } from '#/features/async-replenish/async-replenish-start-card'
import { AsyncReplenishStatusCard } from '#/features/async-replenish/async-replenish-status-card'
import { useAsyncReplenishPageModel } from '#/features/async-replenish/use-async-replenish-page-model'
import { PageHeaderSection } from '#/features/shared/page-header-section'

export const Route = createFileRoute('/async-replenish')({
  component: AsyncReplenishPage,
})

function AsyncReplenishPage() {
  const model = useAsyncReplenishPageModel()

  return (
    <main className="page-wrap space-y-6 px-4 py-8">
      <PageHeaderSection
        kicker="Async Replenish"
        title="Асинхронное пополнение"
        description="Запуск пополнения счета в фоне и мониторинг статуса задачи."
      />

      <AsyncReplenishStartCard
        value={model.form}
        onChange={model.setForm}
        onApply={model.onApply}
        isPending={model.isSubmitPending}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <AsyncReplenishStatusCard
          taskId={model.taskId}
          status={model.status}
          message={model.statusMessage}
          statusTone={model.statusTone}
        />

        <AsyncReplenishMetricsCard
          submitted={model.submitted}
          running={model.running}
          succeeded={model.succeeded}
          failed={model.failed}
          errorMessage={model.metricsErrorMessage}
        />
      </div>
    </main>
  )
}
