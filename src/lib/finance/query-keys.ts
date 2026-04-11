export const financeQueryKeys = {
  users: ['finance', 'users'] as const,
  roles: ['finance', 'roles'] as const,
  currencies: ['finance', 'currencies'] as const,
  accounts: (filters: { userId?: number; currency?: string }) =>
    ['finance', 'accounts', filters] as const,
  operationsList: (senderUserId?: number) =>
    ['finance', 'operations', 'list', senderUserId ?? null] as const,
  operationsSearch: (payload: {
    queryType: string
    page: number
    size: number
    senderUserId?: number
    receiverUserId?: number
    currencyCode?: string
    minAmount?: number
    maxAmount?: number
    fromDate?: string
    toDate?: string
  }) => ['finance', 'operations', 'search', payload] as const,
  asyncMetrics: ['finance', 'async', 'metrics'] as const,
  asyncStatus: (taskId: string) => ['finance', 'async', 'status', taskId] as const,
  raceDemo: (threads: number, incrementsPerThread: number) =>
    ['finance', 'concurrency', threads, incrementsPerThread] as const,
}
