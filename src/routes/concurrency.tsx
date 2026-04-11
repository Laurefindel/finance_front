import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { ConcurrencyResultCard } from '#/features/concurrency/concurrency-result-card'
import { ConcurrencyRunCard } from '#/features/concurrency/concurrency-run-card'
import { useConcurrencyPageModel } from '#/features/concurrency/use-concurrency-page-model'
import { PageHeaderSection } from '#/features/shared/page-header-section'

export const Route = createFileRoute('/concurrency')({
  component: ConcurrencyPage,
})

function ConcurrencyPage() {
  const model = useConcurrencyPageModel({
    onSuccess: (message) => toast.success(message),
    onError: (message) => toast.error(message),
    onWarning: (message) => toast.warning(message),
  })

  return (
    <main className="page-wrap space-y-6 px-4 py-8">
      <PageHeaderSection
        kicker="Concurrency"
        title="Race Condition Demo"
        description="Диагностика race-condition на бэкенде."
      />

      <ConcurrencyRunCard
        value={model.form}
        onChange={model.setForm}
        onApply={model.onApply}
        isPending={model.isSubmitPending}
        limits={model.limits}
        estimatedOperations={model.estimatedOperations}
        isHighRiskLoad={model.isHighRiskLoad}
        isCooldownActive={model.isCooldownActive}
        cooldownSeconds={model.cooldownSeconds}
      />

      <ConcurrencyResultCard result={model.result} />
    </main>
  )
}
