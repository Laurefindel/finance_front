import { createFileRoute } from '@tanstack/react-router'
import { DashboardHeroSection } from '#/features/dashboard/dashboard-hero-section'
import { DashboardModulesCard } from '#/features/dashboard/dashboard-modules-card'
import { DashboardStatsSection } from '#/features/dashboard/dashboard-stats-section'
import { useDashboardPageModel } from '#/features/dashboard/use-dashboard-page-model'

export const Route = createFileRoute('/')({ component: DashboardPage })

function DashboardPage() {
  const model = useDashboardPageModel()

  return (
    <main className="page-wrap space-y-6 px-4 pb-8 pt-10">
      <DashboardHeroSection />

      <DashboardStatsSection cards={model.cards} />

      <DashboardModulesCard />
    </main>
  )
}
