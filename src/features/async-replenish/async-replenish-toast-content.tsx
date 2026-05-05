import { toast } from 'sonner'
import { Badge } from '#/components/ui/badge'
import type { NormalizedAsyncStatus } from './async-replenish-status'

export const ASYNC_TOAST_ID = 'async-replenish-progress'

export interface AsyncMetricsSnapshot {
  submitted: number
  running: number
  succeeded: number
  failed: number
}

export interface AsyncToastDetails {
  accountLabel: string
  amountLabel: string
}

export interface AsyncToastPayload {
  status: NormalizedAsyncStatus
  details: AsyncToastDetails
}

export function buildAsyncToastContent({
  status,
  details,
}: AsyncToastPayload) {
  let statusVariant: 'destructive' | 'default' | 'secondary' = 'secondary'

  if (status === 'FAILED') {
    statusVariant = 'destructive'
  } else if (status === 'SUCCEEDED') {
    statusVariant = 'default'
  }

  return (
    <div className="flex min-w-72 flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">Асинхронное пополнение</p>
        <Badge variant={statusVariant}>{status}</Badge>
      </div>
      <p className="text-xs text-muted-foreground">Счет: {details.accountLabel}</p>
      <p className="text-xs text-muted-foreground">Сумма: {details.amountLabel}</p>
    </div>
  )
}

function showLoadingToast(payload: AsyncToastPayload) {
  toast.loading(buildAsyncToastContent(payload), {
    id: ASYNC_TOAST_ID,
    duration: Infinity,
  })
}

export function showAsyncStartSubmittingToast(details: AsyncToastDetails) {
  showLoadingToast({
    status: 'PENDING',
    details,
  })
}

export function showAsyncStartedToast(
  details: AsyncToastDetails,
) {
  showLoadingToast({
    status: 'RUNNING',
    details,
  })
}

export function showAsyncStartFailedToast(
  details: AsyncToastDetails,
) {
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
}
