import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import type { NormalizedAsyncStatus } from './async-replenish-status'
import {
  ASYNC_TOAST_ID,
  buildAsyncToastContent,
  type AsyncMetricsSnapshot,
} from './async-replenish-toast-content'

interface UseAsyncReplenishToastSyncOptions {
  taskId: string
  status: NormalizedAsyncStatus
  statusMessage: string
  metrics: AsyncMetricsSnapshot
  statusErrorMessage: string | null
  metricsErrorMessage: string | null
}

export function useAsyncReplenishToastSync({
  taskId,
  status,
  statusMessage,
  metrics,
  statusErrorMessage,
  metricsErrorMessage,
}: UseAsyncReplenishToastSyncOptions) {
  const statusToastSignatureRef = useRef('')
  const errorToastSignatureRef = useRef('')

  useEffect(() => {
    if (!taskId) {
      return
    }

    const signature = [
      taskId,
      status,
      statusMessage,
      metrics.submitted,
      metrics.running,
      metrics.succeeded,
      metrics.failed,
    ].join('|')

    if (signature === statusToastSignatureRef.current) {
      return
    }

    statusToastSignatureRef.current = signature

    const content = buildAsyncToastContent({
      taskId,
      status,
      message: statusMessage,
      ...metrics,
    })

    if (status === 'SUCCEEDED') {
      toast.success(content, {
        id: ASYNC_TOAST_ID,
        duration: 9000,
      })
      return
    }

    if (status === 'FAILED') {
      toast.error(content, {
        id: ASYNC_TOAST_ID,
        duration: 10000,
      })
      return
    }

    toast.loading(content, {
      id: ASYNC_TOAST_ID,
      duration: Infinity,
    })
  }, [
    metrics,
    metrics.failed,
    metrics.running,
    metrics.submitted,
    metrics.succeeded,
    status,
    statusMessage,
    taskId,
  ])

  useEffect(() => {
    if (!taskId) {
      return
    }

    if (!statusErrorMessage && !metricsErrorMessage) {
      return
    }

    const signature = [taskId, statusErrorMessage, metricsErrorMessage].join('|')

    if (signature === errorToastSignatureRef.current) {
      return
    }

    errorToastSignatureRef.current = signature

    const details = [
      statusErrorMessage
        ? `Не удалось получить статус задачи: ${statusErrorMessage}`
        : null,
      metricsErrorMessage
        ? `Не удалось получить метрики: ${metricsErrorMessage}`
        : null,
    ].filter((value): value is string => Boolean(value))

    toast.error(
      buildAsyncToastContent({
        taskId,
        status: 'FAILED',
        message: details.join(' | '),
        ...metrics,
      }),
      {
        id: ASYNC_TOAST_ID,
        duration: 10000,
      },
    )
  }, [
    metrics,
    metrics.failed,
    metrics.running,
    metrics.submitted,
    metrics.succeeded,
    metricsErrorMessage,
    statusErrorMessage,
    taskId,
  ])
}
