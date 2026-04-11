import type { ColumnDef } from '@tanstack/react-table'
import type { Dispatch, FormEvent, SetStateAction } from 'react'

export interface FormActionModel<TFormState> {
  form: TFormState
  setForm: Dispatch<SetStateAction<TFormState>>
  onApply: (event: FormEvent<HTMLFormElement>) => void
  isPending: boolean
}

export interface FiltersActionModel<TFiltersState> {
  form: TFiltersState
  setForm: Dispatch<SetStateAction<TFiltersState>>
  onApply: (event: FormEvent<HTMLFormElement>) => void
  onReset: () => void
}

export interface TriggerActionModel {
  onApply: () => void
  isPending: boolean
}

export interface PaginationActionModel {
  currentPage: number
  totalPages: number
  canPrev: boolean
  canNext: boolean
  onPrev: () => void
  onNext: () => void
}

export interface TableViewModel<TData, TValue = unknown> {
  columns: Array<ColumnDef<TData, TValue>>
  rows: TData[]
  rowsErrorMessage: string | null
}
