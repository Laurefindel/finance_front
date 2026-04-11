import { useState, type FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { FormActionModel } from '#/features/shared/action-models'
import { runRaceDemoFn } from '#/lib/finance/finance.functions'
import { getErrorMessage } from '#/lib/finance/error-utils'
import {
  defaultConcurrencyForm,
  type ConcurrencyFormState,
} from './types'

function createDefaultForm(): ConcurrencyFormState {
  return { ...defaultConcurrencyForm }
}

export function useConcurrencyPageModel() {
  const [form, setForm] = useState<ConcurrencyFormState>(createDefaultForm)

  const runDemoMutation = useMutation({
    mutationFn: (payload: { threads: number; incrementsPerThread: number }) =>
      runRaceDemoFn({ data: payload }),
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  const onApply = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const threads = Number(form.threads)
    const incrementsPerThread = Number(form.incrementsPerThread)

    if (!Number.isFinite(threads) || threads < 50) {
      toast.error('threads должен быть не меньше 50')
      return
    }

    if (!Number.isFinite(incrementsPerThread) || incrementsPerThread < 1) {
      toast.error('incrementsPerThread должен быть больше 0')
      return
    }

    try {
      await runDemoMutation.mutateAsync({ threads, incrementsPerThread })
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
    result: runDemoMutation.data ?? null,
  }
}
