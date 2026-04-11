export interface ConcurrencyLimits {
  minThreads: number
  maxThreads: number
  minIncrementsPerThread: number
  maxIncrementsPerThread: number
  warningTotalOperations: number
  maxTotalOperations: number
  cooldownMs: number
}

export const concurrencyLimits: ConcurrencyLimits = {
  minThreads: 50,
  maxThreads: 256,
  minIncrementsPerThread: 1,
  maxIncrementsPerThread: 200000,
  warningTotalOperations: 5000000,
  maxTotalOperations: 20000000,
  cooldownMs: 15000,
}

export interface ConcurrencyFormState {
  threads: string
  incrementsPerThread: string
  acknowledgedRisk: boolean
}

export const defaultConcurrencyForm: ConcurrencyFormState = {
  threads: '64',
  incrementsPerThread: '10000',
  acknowledgedRisk: false,
}
