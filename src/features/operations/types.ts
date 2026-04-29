export interface OperationFilterState {
  senderUserId: string
  receiverUserId: string
  currencyCode: string
  minAmount: string
  maxAmount: string
  fromDate: string
  toDate: string
  size: string
}

export const defaultOperationFilters: OperationFilterState = {
  senderUserId: '',
  receiverUserId: '',
  currencyCode: '',
  minAmount: '',
  maxAmount: '',
  fromDate: '',
  toDate: '',
  size: '10',
}

export interface OperationCreateFormState {
  senderAccountId: string
  receiverAccountId: string
  amount: string
  description: string
}

export const defaultOperationCreateForm: OperationCreateFormState = {
  senderAccountId: '',
  receiverAccountId: '',
  amount: '',
  description: '',
}

export const defaultBulkOperationsPayload =
  '[\n  {"senderAccountId": 1, "receiverAccountId": 2, "amount": 25.5, "description": "Обед"}\n]'
