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

export interface BulkOperationItemState {
  id: string
  receiverAccountId: string
  amount: string
  description: string
}

export interface BulkOperationsFormState {
  senderUserId: string
  senderAccountId: string
  items: BulkOperationItemState[]
}

export function createBulkOperationItem(): BulkOperationItemState {
  return {
    id: `bulk-${crypto.randomUUID()}`,
    receiverAccountId: '',
    amount: '',
    description: '',
  }
}

export const defaultBulkOperationsForm: BulkOperationsFormState = {
  senderUserId: '',
  senderAccountId: '',
  items: [createBulkOperationItem()],
}
