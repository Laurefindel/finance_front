import { useMemo, useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import { Button } from '#/components/ui/button'
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
import { getErrorMessage } from '#/lib/finance/error-utils'
import { financeQueryKeys } from '#/lib/finance/query-keys'
import type { CurrencyRequest, CurrencyResponse } from '#/lib/finance/schemas'
import {
  defaultCreateCurrencyForm,
  defaultUpdateCurrencyForm,
  type CreateCurrencyFormState,
  type UpdateCurrencyFormState,
} from './types'

function createDefaultCreateForm(): CreateCurrencyFormState {
  return { ...defaultCreateCurrencyForm }
}

function createDefaultUpdateForm(): UpdateCurrencyFormState {
  return { ...defaultUpdateCurrencyForm }
}

export function useCurrenciesPageModel() {
  const queryClient = useQueryClient()

  const [createForm, setCreateForm] =
    useState<CreateCurrencyFormState>(createDefaultCreateForm)
  const [updateForm, setUpdateForm] =
    useState<UpdateCurrencyFormState>(createDefaultUpdateForm)

  const currenciesQuery = useQuery({
    queryKey: financeQueryKeys.currencies,
    queryFn: () => listCurrenciesFn(),
  })

  const createMutation = useMutation({
    mutationFn: (payload: CurrencyRequest) => createCurrencyFn({ data: payload }),
    onSuccess: async () => {
      toast.success('Валюта создана')
      setCreateForm(createDefaultCreateForm())
      await queryClient.invalidateQueries({
        queryKey: financeQueryKeys.currencies,
      })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  const updateMutation = useMutation({
    mutationFn: (payload: { id: number; payload: CurrencyRequest }) =>
      updateCurrencyFn({ data: payload }),
    onSuccess: async () => {
      toast.success('Валюта обновлена')
      setUpdateForm(createDefaultUpdateForm())
      await queryClient.invalidateQueries({
        queryKey: financeQueryKeys.currencies,
      })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCurrencyFn({ data: { id } }),
    onSuccess: async () => {
      toast.success('Валюта удалена')
      await queryClient.invalidateQueries({
        queryKey: financeQueryKeys.currencies,
      })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  const columns = useMemo<Array<ColumnDef<CurrencyResponse>>>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
      },
      {
        accessorKey: 'code',
        header: 'Код',
      },
      {
        accessorKey: 'name',
        header: 'Название',
      },
      {
        id: 'actions',
        header: 'Действия',
        cell: ({ row }) => {
          const id = row.original.id

          return (
            <Button
              variant="destructive"
              size="sm"
              disabled={!id || deleteMutation.isPending}
              onClick={() => {
                if (!id) {
                  return
                }

                if (window.confirm(`Удалить валюту #${id}?`)) {
                  deleteMutation.mutate(id)
                }
              }}
            >
              Удалить
            </Button>
          )
        },
      },
    ],
    [deleteMutation],
  )

  const onCreateSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

  const onUpdateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const parsedId = Number(updateForm.id)

    if (!Number.isFinite(parsedId) || parsedId <= 0) {
      toast.error('Укажите корректный ID валюты')
      return
    }

    try {
      await updateMutation.mutateAsync({
        id: parsedId,
        payload: {
          code: updateForm.code.trim().toUpperCase(),
          name: updateForm.name.trim(),
        },
      })
    } catch {
      // onError already shows a toast; swallow to avoid unhandled promise in console.
    }
  }

  const create: FormActionModel<CreateCurrencyFormState> = {
    form: createForm,
    setForm: setCreateForm,
    onApply: onCreateSubmit,
    isPending: createMutation.isPending,
  }

  const update: FormActionModel<UpdateCurrencyFormState> = {
    form: updateForm,
    setForm: setUpdateForm,
    onApply: onUpdateSubmit,
    isPending: updateMutation.isPending,
  }

  const table: TableViewModel<CurrencyResponse> = {
    columns,
    rows: currenciesQuery.data ?? [],
    rowsErrorMessage: currenciesQuery.error ? getErrorMessage(currenciesQuery.error) : null,
  }

  return {
    create,
    update,
    table,
  }
}
