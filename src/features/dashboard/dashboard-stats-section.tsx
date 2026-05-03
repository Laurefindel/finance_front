import { Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import type { DashboardStatCard } from './types'

interface DashboardStatsSectionProps {
  readonly cards: readonly DashboardStatCard[]
}

export function DashboardStatsSection({ cards }: DashboardStatsSectionProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <article
          key={card.title}
          className="island-shell feature-card rise-in rounded-2xl p-5"
          style={{ animationDelay: `${index * 90 + 80}ms` }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {card.title}
          </p>
          <p className="mt-2 text-3xl font-bold text-(--sea-ink)">{card.value}</p>
          <p className="mt-2 text-sm text-(--sea-ink-soft)">{card.description}</p>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="mt-4 border-(--chip-line) bg-(--surface-strong) text-(--sea-ink) hover:bg-(--link-bg-hover)"
          >
            <Link to={card.to}>Перейти</Link>
          </Button>
        </article>
      ))}
    </section>
  )
}
