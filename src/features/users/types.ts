import type { UserResponse } from '#/lib/finance/schemas'

export interface UserFormState {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface UserAccountSummary {
  id: number
  balance: number | undefined
  currencyCode: string
  currencyName: string
}

export interface UserTableRow extends UserResponse {
  accountsSummary: UserAccountSummary[]
}

export const defaultUserFormState: UserFormState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
}
