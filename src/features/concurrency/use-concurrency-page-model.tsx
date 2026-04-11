import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import type { FormActionModel } from '#/features/shared/action-models'
import { runRaceDemoFn } from '#/lib/finance/finance.functions'
import { getErrorMessage } from '#/lib/finance/errors/error-message'
import {
  concurrencyLimits,
  defaultConcurrencyForm,
  type ConcurrencyFormState,
} from './types'

function createDefaultForm(): ConcurrencyFormState {
  return { ...defaultConcurrencyForm }
}

interface ConcurrencyPageModelNotifications {
  onSuccess?: (message: string) => void
  onError?: (message: string) => void
  onWarning?: (message: string) => void
}

type ValidationIssueLevel = 'warning' | 'error'

interface ValidationIssue {
  level: ValidationIssueLevel
  message: string
}

interface ValidateConcurrencySubmitOptions {
  acknowledgedRisk: boolean
  isCooldownActive: boolean
  cooldownSeconds: number
  threads: number
  incrementsPerThread: number
}

function validateConcurrencySubmit({
  acknowledgedRisk,
  isCooldownActive,
  cooldownSeconds,
  threads,
  incrementsPerThread,
}: ValidateConcurrencySubmitOptions): ValidationIssue | null {
  if (!acknowledgedRisk) {
    return {
      level: 'warning',
      message: 'Подтвердите согласие с риском перед запуском теста',
    }
  }

  if (isCooldownActive) {
    return {
      level: 'warning',
      message: `Следующий запуск будет доступен через ${cooldownSeconds} сек.`,
    }
  }

  if (
    !Number.isInteger(threads) ||
    threads < concurrencyLimits.minThreads ||
    threads > concurrencyLimits.maxThreads
  ) {
    return {
      level: 'error',
      message: `threads должен быть целым числом от ${concurrencyLimits.minThreads} до ${concurrencyLimits.maxThreads}`,
    }
  }

  if (
    !Number.isInteger(incrementsPerThread) ||
    incrementsPerThread < concurrencyLimits.minIncrementsPerThread ||
    incrementsPerThread > concurrencyLimits.maxIncrementsPerThread
  ) {
    return {
      level: 'error',
      message: `incrementsPerThread должен быть целым числом от ${concurrencyLimits.minIncrementsPerThread} до ${concurrencyLimits.maxIncrementsPerThread}`,
    }
  }

  const totalOperations = threads * incrementsPerThread

  if (totalOperations > concurrencyLimits.maxTotalOperations) {
    return {
      level: 'error',
      message: `Слишком высокая нагрузка (${totalOperations.toLocaleString('ru-RU')} операций). Максимум: ${concurrencyLimits.maxTotalOperations.toLocaleString('ru-RU')}`,
    }
  }

  return null
}

export function useConcurrencyPageModel(
  notifications?: ConcurrencyPageModelNotifications,
) {
  const [form, setForm] = useState<ConcurrencyFormState>(createDefaultForm)
  const [cooldownUntilMs, setCooldownUntilMs] = useState(0)
  const [nowMs, setNowMs] = useState(() => Date.now())

  useEffect(() => {
    if (cooldownUntilMs <= Date.now()) {
      return
    }

    const timerId = window.setInterval(() => {
      const nextNow = Date.now()

      setNowMs(nextNow)

      if (nextNow >= cooldownUntilMs) {
        window.clearInterval(timerId)
      }
    }, 1000)

    return () => {
      window.clearInterval(timerId)
    }
  }, [cooldownUntilMs])

  const threads = Number(form.threads)
  const incrementsPerThread = Number(form.incrementsPerThread)

  const estimatedOperations = useMemo(() => {
    if (!Number.isFinite(threads) || !Number.isFinite(incrementsPerThread)) {
      return 0
    }

    return Math.max(0, Math.trunc(threads) * Math.trunc(incrementsPerThread))
  }, [incrementsPerThread, threads])

  const isHighRiskLoad = estimatedOperations >= concurrencyLimits.warningTotalOperations

  const cooldownSeconds = Math.ceil(
    Math.max(0, cooldownUntilMs - nowMs) / 1000,
  )

  const isCooldownActive = cooldownSeconds > 0

  const runDemoMutation = useMutation({
    mutationFn: (payload: { threads: number; incrementsPerThread: number }) =>
      runRaceDemoFn({ data: payload }),
    onSuccess: (result) => {
      notifications?.onSuccess?.(
        result.raceConditionDetected
          ? 'Тест завершен: race-condition подтвержден'
          : 'Тест завершен: race-condition не обнаружен',
      )
    },
    onError: (error) => {
      notifications?.onError?.(getErrorMessage(error))
    },
  })

  const onApply = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationIssue = validateConcurrencySubmit({
      acknowledgedRisk: form.acknowledgedRisk,
      isCooldownActive,
      cooldownSeconds,
      threads,
      incrementsPerThread,
    })

    if (validationIssue) {
      if (validationIssue.level === 'warning') {
        notifications?.onWarning?.(validationIssue.message)
      } else {
        notifications?.onError?.(validationIssue.message)
      }

      return
    }

    try {
      await runDemoMutation.mutateAsync({ threads, incrementsPerThread })

      const cooldownStartedAt = Date.now()
      setNowMs(cooldownStartedAt)
      setCooldownUntilMs(cooldownStartedAt + concurrencyLimits.cooldownMs)

      setForm((prev) => ({ ...prev, acknowledgedRisk: false }))
    } catch {
      // onError already shows a toast; swallow to avoid unhandled promise in console.
    }
  }

  const run: FormActionModel<ConcurrencyFormState> = {
    form,
    setForm,
    onApply,
    isPending: runDemoMutation.isPending,
  }

  return {
    form: run.form,
    setForm: run.setForm,
    onApply: run.onApply,
    isSubmitPending: run.isPending,
    isCooldownActive,
    cooldownSeconds,
    estimatedOperations,
    isHighRiskLoad,
    limits: concurrencyLimits,
    result: runDemoMutation.data ?? null,
  }
}
