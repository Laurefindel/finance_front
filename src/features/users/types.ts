export interface UserFormState {
  firstName: string
  lastName: string
  email: string
  password: string
}

export const defaultUserFormState: UserFormState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
}
