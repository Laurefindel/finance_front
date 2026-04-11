import { Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'

export function DashboardHeroSection() {
  return (
    <section className="island-shell rise-in relative overflow-hidden rounded-4xl px-6 py-10 sm:px-10 sm:py-12">
      <p className="island-kicker mb-3">Finance API Frontend</p>
      <h1 className="display-title mb-4 max-w-4xl text-4xl leading-[1.02] font-bold tracking-tight text-(--sea-ink) sm:text-6xl">
        Панель управления финансовым API
      </h1>
      <p className="max-w-3xl text-base text-(--sea-ink-soft) sm:text-lg">
        Приложение построено на TanStack Start, shadcn/ui и Tailwind v4. Все
        запросы к backend выполняются через server functions.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/operations">Открыть операции</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/async-replenish">Async Replenish</Link>
        </Button>
      </div>
    </section>
  )
}
