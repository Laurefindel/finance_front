import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import type { NormalizedAsyncStatus } from './async-replenish-status'
import {
  ASYNC_TOAST_ID,
  buildAsyncToastContent,
  type AsyncToastDetails,
} from './async-replenish-toast-content'

interface UseAsyncReplenishToastSyncOptions {
  taskId: string
  status: NormalizedAsyncStatus
  details: AsyncToastDetails
  statusErrorMessage: string | null
  metricsErrorMessage: string | null
}

export function useAsyncReplenishToastSync({
  taskId,
  status,
  details,
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
      details.accountLabel,
      details.amountLabel,
    ].join('|')

    if (signature === statusToastSignatureRef.current) {
      return
    }

    statusToastSignatureRef.current = signature

    const content = buildAsyncToastContent({
      status,
      details,
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
  }, [details.accountLabel, details.amountLabel, status, taskId])

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

    toast.error(
      buildAsyncToastContent({
        status: 'FAILED',
        details,
      }),
      {
        id: ASYNC_TOAST_ID,
        duration: 10000,
      },
    )
  }, [details, metricsErrorMessage, statusErrorMessage, taskId])
}
