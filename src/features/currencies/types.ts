export interface CreateCurrencyFormState {
  code: string
  name: string
}

export const defaultCreateCurrencyForm: CreateCurrencyFormState = {
  code: '',
  name: '',
}

export interface UpdateCurrencyFormState {
  currentCode: string
  code: string
  name: string
}

export const defaultUpdateCurrencyForm: UpdateCurrencyFormState = {
  currentCode: '',
  code: '',
  name: '',
}
