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

export interface AsyncToastPayload extends AsyncMetricsSnapshot {
  taskId: string
  status: NormalizedAsyncStatus
  message: string
}

export function buildAsyncToastContent({
  taskId,
  status,
  message,
  submitted,
  running,
  succeeded,
  failed,
}: AsyncToastPayload) {
  const statusVariant =
    status === 'FAILED'
      ? 'destructive'
      : status === 'SUCCEEDED'
        ? 'default'
        : 'secondary'

  return (
    <div className="flex min-w-72 flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">Async replenish</p>
        <Badge variant={statusVariant}>{status}</Badge>
      </div>
      <p className="text-xs text-muted-foreground">taskId: {taskId}</p>
      <p className="text-xs leading-relaxed">{message}</p>
      <div className="grid grid-cols-2 gap-1 text-[11px] sm:grid-cols-4">
        <span className="rounded-md bg-muted px-2 py-1">submitted: {submitted}</span>
        <span className="rounded-md bg-muted px-2 py-1">running: {running}</span>
        <span className="rounded-md bg-muted px-2 py-1">succeeded: {succeeded}</span>
        <span className="rounded-md bg-muted px-2 py-1">failed: {failed}</span>
      </div>
      <p className="text-[10px] text-muted-foreground">
        Этапы: запуск задачи, мониторинг статуса и обновление метрик.
      </p>
    </div>
  )
}

function showLoadingToast(payload: AsyncToastPayload) {
  toast.loading(buildAsyncToastContent(payload), {
    id: ASYNC_TOAST_ID,
    duration: Infinity,
  })
}

export function showAsyncStartSubmittingToast(metrics: AsyncMetricsSnapshot) {
  showLoadingToast({
    taskId: 'ожидание ответа',
    status: 'PENDING',
    message: 'Отправляем задачу на асинхронное пополнение.',
    ...metrics,
  })
}

export function showAsyncStartedToast(
  taskId: string,
  metrics: AsyncMetricsSnapshot,
) {
  showLoadingToast({
    taskId,
    status: 'PENDING',
    message: 'Задача запущена, ожидаем выполнение.',
    ...metrics,
  })
}

export function showAsyncStartFailedToast(
  errorMessage: string,
  metrics: AsyncMetricsSnapshot,
) {
  toast.error(
    buildAsyncToastContent({
      taskId: 'не получен',
      status: 'FAILED',
      message: `Не удалось запустить задачу: ${errorMessage}`,
      ...metrics,
    }),
    {
      id: ASYNC_TOAST_ID,
      duration: 10000,
    },
  )
}
