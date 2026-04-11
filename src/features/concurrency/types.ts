export interface ConcurrencyFormState {
  threads: string
  incrementsPerThread: string
}

export const defaultConcurrencyForm: ConcurrencyFormState = {
  threads: '64',
  incrementsPerThread: '10000',
}
