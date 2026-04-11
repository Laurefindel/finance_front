export interface AsyncReplenishFormState {
  accountId: string
  amount: string
}

export const defaultAsyncReplenishForm: AsyncReplenishFormState = {
  accountId: '',
  amount: '',
}

export type AsyncTaskStatusTone = 'default' | 'destructive' | 'secondary'
