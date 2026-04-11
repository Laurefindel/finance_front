export interface CreateCurrencyFormState {
  code: string
  name: string
}

export const defaultCreateCurrencyForm: CreateCurrencyFormState = {
  code: '',
  name: '',
}

export interface UpdateCurrencyFormState {
  id: string
  code: string
  name: string
}

export const defaultUpdateCurrencyForm: UpdateCurrencyFormState = {
  id: '',
  code: '',
  name: '',
}
