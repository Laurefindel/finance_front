import type { AsyncTaskStatusTone } from './types'

export type NormalizedAsyncStatus = 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED'

export function normalizeAsyncStatus(
  rawStatus: string | null | undefined,
): NormalizedAsyncStatus {
  const status = rawStatus?.trim().toUpperCase()

  if (
    status === 'SUCCEEDED' ||
    status === 'SUCCESS' ||
    status === 'COMPLETED' ||
    status === 'DONE'
  ) {
    return 'SUCCEEDED'
  }

  if (status === 'FAILED' || status === 'FAIL' || status === 'ERROR') {
    return 'FAILED'
  }

  if (
    status === 'RUNNING' ||
    status === 'IN_PROGRESS' ||
    status === 'STARTED' ||
    status === 'PROCESSING'
  ) {
    return 'RUNNING'
  }

  return 'PENDING'
}

export function mapStatusToTone(status: NormalizedAsyncStatus): AsyncTaskStatusTone {
  if (status === 'SUCCEEDED') {
    return 'default'
  }

  if (status === 'FAILED') {
    return 'destructive'
  }

  return 'secondary'
}

export function buildStatusDescription(status: NormalizedAsyncStatus) {
  if (status === 'RUNNING') {
    return 'Операция выполняется в фоне'
  }

  if (status === 'SUCCEEDED') {
    return 'Асинхронное пополнение завершено успешно'
  }

  if (status === 'FAILED') {
    return 'Асинхронное пополнение завершилось с ошибкой'
  }

  return 'Задача поставлена в очередь'
}
