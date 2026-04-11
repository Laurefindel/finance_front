import { useMemo, useState, type FormEvent } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
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

function createDefaultFormState(): AsyncReplenishFormState {
  return { ...defaultAsyncReplenishForm }
}

export function useAsyncReplenishPageModel() {
  const [form, setForm] = useState<AsyncReplenishFormState>(createDefaultFormState)
  const [taskId, setTaskId] = useState('')

  const startMutation = useMutation({
    mutationFn: (payload: { accountId: number; amount: number }) =>
      startAsyncReplenishFn({ data: payload }),
    onSuccess: (data) => {
      setTaskId(data.taskId)
      toast.success('Асинхронная задача запущена')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  const metricsQuery = useQuery({
    queryKey: financeQueryKeys.asyncMetrics,
    queryFn: () => getAsyncMetricsFn(),
    refetchInterval: 5000,
  })

  const statusQuery = useQuery({
    queryKey: financeQueryKeys.asyncStatus(taskId),
    queryFn: () => getAsyncStatusFn({ data: { taskId } }),
    enabled: Boolean(taskId),
    refetchInterval: 2500,
  })

  const statusTone = useMemo<AsyncTaskStatusTone>(() => {
    const status = statusQuery.data?.status?.toUpperCase()

    if (status === 'SUCCEEDED') {
      return 'default'
    }

    if (status === 'FAILED') {
      return 'destructive'
    }

    return 'secondary'
  }, [statusQuery.data?.status])

  const onApply = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const accountId = Number(form.accountId)
    const amount = Number(form.amount)

    if (!Number.isFinite(accountId) || !Number.isFinite(amount)) {
      toast.error('Укажите корректные accountId и amount')
      return
    }

    try {
      await startMutation.mutateAsync({ accountId, amount })
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
    status: statusQuery.data?.status ?? null,
    statusMessage: statusQuery.data?.message ?? null,
    statusTone,
    metricsErrorMessage: metricsQuery.error ? getErrorMessage(metricsQuery.error) : null,
    submitted: metricsQuery.data?.submitted ?? 0,
    running: metricsQuery.data?.running ?? 0,
    succeeded: metricsQuery.data?.succeeded ?? 0,
    failed: metricsQuery.data?.failed ?? 0,
  }
}
