import type { ColumnDef } from '@tanstack/react-table'
import type { Dispatch, SetStateAction } from 'react'

export interface FormCardProps<TFormState> {
  value: TFormState
  onChange: Dispatch<SetStateAction<TFormState>>
  onApply: (event: React.SubmitEvent<HTMLFormElement>) => void
  isPending: boolean
}

export interface TableCardProps<TData, TValue = unknown> {
  columns: Array<ColumnDef<TData, TValue>>
  data: TData[]
  errorMessage: string | null
}
