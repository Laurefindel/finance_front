import { Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'

export function DashboardHeroSection() {
  return (
    <section className="island-shell rise-in relative overflow-hidden rounded-4xl px-6 py-10 sm:px-10 sm:py-12">
      <p className="island-kicker mb-3">Финансовая консоль</p>
      <h1 className="display-title mb-4 max-w-4xl text-4xl leading-[1.02] font-bold tracking-tight text-(--sea-ink) sm:text-6xl">
        Панель управления финансовым API
      </h1>
      <p className="max-w-3xl text-base text-(--sea-ink-soft) sm:text-lg">
        Управляйте счетами, пользователями, валютами и операциями в одном месте.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild className="bg-foreground text-background hover:bg-foreground/90">
          <Link to="/operations">Открыть операции</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-(--chip-line) bg-(--surface-strong) text-(--sea-ink) hover:bg-(--link-bg-hover)"
        >
          <Link to="/accounts">Пополнение счетов</Link>
        </Button>
      </div>
    </section>
  )
}
