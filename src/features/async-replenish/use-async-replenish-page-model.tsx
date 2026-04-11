import { useMemo, useState, type FormEvent } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { FormActionModel } from '#/features/shared/action-models'
import {
  getAsyncMetricsFn,
  getAsyncStatusFn,
  startAsyncReplenishFn,
} from '#/lib/finance/finance.functions'
import { getErrorMessage } from '#/lib/finance/error-utils'
import { financeQueryKeys } from '#/lib/finance/query-keys'
import {
  defaultAsyncReplenishForm,
  type AsyncReplenishFormState,
  type AsyncTaskStatusTone,
} from './types'
import {
  buildStatusDescription,
  mapStatusToTone,
  normalizeAsyncStatus,
} from './async-replenish-status'
import type { AsyncMetricsSnapshot } from './async-replenish-toast-content'

const ASYNC_STATUS_POLL_MS = 2500
const ASYNC_METRICS_POLL_MS = 2500
const ASYNC_IDLE_METRICS_POLL_MS = 6000

interface AsyncReplenishPageModelNotifications {
  onValidationError?: (message: string) => void
  onStartSubmitting?: (metrics: AsyncMetricsSnapshot) => void
  onStartSuccess?: (taskId: string, metrics: AsyncMetricsSnapshot) => void
  onStartError?: (message: string, metrics: AsyncMetricsSnapshot) => void
}

function createDefaultFormState(): AsyncReplenishFormState {
  return { ...defaultAsyncReplenishForm }
}

export function useAsyncReplenishPageModel(
  notifications?: AsyncReplenishPageModelNotifications,
) {
  const [form, setForm] = useState<AsyncReplenishFormState>(createDefaultFormState)
  const [taskId, setTaskId] = useState('')

  const statusQuery = useQuery({
    queryKey: financeQueryKeys.asyncStatus(taskId),
    queryFn: () => getAsyncStatusFn({ data: { taskId } }),
    enabled: Boolean(taskId),
    refetchInterval: (query) => {
      const status = normalizeAsyncStatus(query.state.data?.status)

      if (status === 'SUCCEEDED' || status === 'FAILED') {
        return false
      }

      return ASYNC_STATUS_POLL_MS
    },
  })

  const normalizedStatus = useMemo(
    () => normalizeAsyncStatus(statusQuery.data?.status),
    [statusQuery.data?.status],
  )

  const isTerminalStatus =
    normalizedStatus === 'SUCCEEDED' || normalizedStatus === 'FAILED'

  const metricsQuery = useQuery({
    queryKey: financeQueryKeys.asyncMetrics,
    queryFn: () => getAsyncMetricsFn(),
    refetchInterval: !taskId
      ? ASYNC_IDLE_METRICS_POLL_MS
      : isTerminalStatus
        ? false
        : ASYNC_METRICS_POLL_MS,
  })

  const metrics = useMemo<AsyncMetricsSnapshot>(
    () => ({
      submitted: metricsQuery.data?.submitted ?? 0,
      running: metricsQuery.data?.running ?? 0,
      succeeded: metricsQuery.data?.succeeded ?? 0,
      failed: metricsQuery.data?.failed ?? 0,
    }),
    [
      metricsQuery.data?.failed,
      metricsQuery.data?.running,
      metricsQuery.data?.submitted,
      metricsQuery.data?.succeeded,
    ],
  )

  const statusMessage =
    statusQuery.data?.message?.trim() || buildStatusDescription(normalizedStatus)

  const statusErrorMessage = statusQuery.error
    ? getErrorMessage(statusQuery.error)
    : null
  const metricsErrorMessage = metricsQuery.error
    ? getErrorMessage(metricsQuery.error)
    : null

  const startMutation = useMutation({
    mutationFn: (payload: { accountId: number; amount: number }) =>
      startAsyncReplenishFn({ data: payload }),
    onMutate: () => {
      notifications?.onStartSubmitting?.(metrics)
    },
    onSuccess: async (data) => {
      setTaskId(data.taskId)

      notifications?.onStartSuccess?.(data.taskId, metrics)

      await metricsQuery.refetch()
    },
    onError: (error) => {
      notifications?.onStartError?.(getErrorMessage(error), metrics)
    },
  })

  const statusTone = useMemo<AsyncTaskStatusTone>(() => {
    return mapStatusToTone(normalizedStatus)
  }, [normalizedStatus])

  const onApply = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const accountId = Number(form.accountId)
    const amount = Number(form.amount)

    if (!Number.isInteger(accountId) || accountId <= 0 || !Number.isFinite(amount) || amount < 0) {
      notifications?.onValidationError?.('Укажите корректные accountId и amount')
      return
    }

    setTaskId('')

    try {
      await startMutation.mutateAsync({ accountId, amount })
      setForm(createDefaultFormState())
    } catch {
      // onError already shows a toast; swallow to avoid unhandled promise in console.
    }
  }

  const start: FormActionModel<AsyncReplenishFormState> = {
    form,
    setForm,
    onApply,
    isPending: startMutation.isPending,
  }

  return {
    form: start.form,
    setForm: start.setForm,
    onApply: start.onApply,
    isSubmitPending: start.isPending,
    taskId,
    status: normalizedStatus,
    statusMessage,
    statusTone,
    metricsErrorMessage,
    submitted: metrics.submitted,
    running: metrics.running,
    succeeded: metrics.succeeded,
    failed: metrics.failed,
    toastSync: {
      taskId,
      status: normalizedStatus,
      statusMessage,
      metrics,
      statusErrorMessage,
      metricsErrorMessage,
    },
  }
}
