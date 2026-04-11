export interface DashboardStatCard {
  title: string
  value: number
  to: '/users' | '/roles' | '/currencies' | '/accounts' | '/operations'
  description: string
}
