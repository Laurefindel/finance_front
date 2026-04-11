export interface AccountsFiltersState {
  userId: string
  currency: string
}

export const defaultAccountsFilters: AccountsFiltersState = {
  userId: '',
  currency: '',
}

export interface CreateAccountFormState {
  userId: string
  currencyId: string
}

export const defaultCreateAccountForm: CreateAccountFormState = {
  userId: '',
  currencyId: '',
}

export interface ReplenishAccountFormState {
  id: string
  amount: string
}

export const defaultReplenishAccountForm: ReplenishAccountFormState = {
  id: '',
  amount: '',
}
