import { useState, type SyntheticEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import type {
  FormActionModel,
  TableViewModel,
} from '#/features/shared/action-models'
import {
  createCurrencyFn,
  deleteCurrencyFn,
  listCurrenciesFn,
  updateCurrencyFn,
} from '#/lib/finance/finance.functions'
import { getErrorMessage } from '#/lib/finance/errors/error-message'
import { financeQueryKeys } from '#/lib/finance/queries/query-keys'
import type { CurrencyRequest, CurrencyResponse } from '#/lib/finance/schemas'
import {
  defaultCreateCurrencyForm,
  type CreateCurrencyFormState,
} from './types'

function createDefaultCreateForm(): CreateCurrencyFormState {
  return { ...defaultCreateCurrencyForm }
}

interface CurrenciesPageModelNotifications {
  onSuccess?: (message: string) => void
  onError?: (message: string) => void
}

interface DeleteCurrencyAction {
  onDelete: (id: number) => Promise<void>
  isPending: boolean
}

interface UpdateCurrencyAction {
  onUpdate: (id: number, payload: CurrencyRequest) => Promise<void>
  isPending: boolean
}

export function useCurrenciesPageModel(
  notifications?: CurrenciesPageModelNotifications,
) {
  const queryClient = useQueryClient()

  const [createForm, setCreateForm] =
    useState<CreateCurrencyFormState>(createDefaultCreateForm)

  const currenciesQuery = useQuery({
    queryKey: financeQueryKeys.currencies,
    queryFn: () => listCurrenciesFn(),
  })

  const createMutation = useMutation({
    mutationFn: (payload: CurrencyRequest) => createCurrencyFn({ data: payload }),
    onSuccess: async () => {
      notifications?.onSuccess?.('Валюта создана')
      setCreateForm(createDefaultCreateForm())
      await queryClient.invalidateQueries({
        queryKey: financeQueryKeys.currencies,
      })
    },
    onError: (error) => {
      notifications?.onError?.(getErrorMessage(error))
    },
  })

  const updateMutation = useMutation({
    mutationFn: (payload: { id: number; payload: CurrencyRequest }) =>
      updateCurrencyFn({ data: payload }),
    onSuccess: async () => {
      notifications?.onSuccess?.('Валюта обновлена')
      await queryClient.invalidateQueries({
        queryKey: financeQueryKeys.currencies,
      })
    },
    onError: (error) => {
      notifications?.onError?.(getErrorMessage(error))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCurrencyFn({ data: { id } }),
    onSuccess: async () => {
      notifications?.onSuccess?.('Валюта удалена')
      await queryClient.invalidateQueries({
        queryKey: financeQueryKeys.currencies,
      })
    },
    onError: (error) => {
      notifications?.onError?.(getErrorMessage(error))
    },
  })

  const onCreateSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      await createMutation.mutateAsync({
        code: createForm.code.trim().toUpperCase(),
        name: createForm.name.trim(),
      })
    } catch {
      // onError already shows a toast; swallow to avoid unhandled promise in console.
    }
  }

  const onDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id)
    } catch {
      // onError already reports the issue.
    }
  }

  const onUpdate = async (id: number, payload: CurrencyRequest) => {
    try {
      await updateMutation.mutateAsync({ id, payload })
    } catch {
      // onError already reports the issue.
    }
  }

  const create: FormActionModel<CreateCurrencyFormState> = {
    form: createForm,
    setForm: setCreateForm,
    onApply: onCreateSubmit,
    isPending: createMutation.isPending,
  }

  const update: UpdateCurrencyAction = {
    onUpdate,
    isPending: updateMutation.isPending,
  }

  const columns: Array<ColumnDef<CurrencyResponse>> = [
    {
      accessorKey: 'code',
      header: 'Code',
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
  ]

  const table: TableViewModel<CurrencyResponse> = {
    columns,
    rows: currenciesQuery.data ?? [],
    rowsErrorMessage: currenciesQuery.error ? getErrorMessage(currenciesQuery.error) : null,
  }

  const remove: DeleteCurrencyAction = {
    onDelete,
    isPending: deleteMutation.isPending,
  }

  return {
    create,
    update,
    table,
    remove,
  }
}
