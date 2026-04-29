import { useState } from 'react'
import { MenuIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#/components/ui/sheet'
import ThemeToggle from './ThemeToggle'

const appLinks = [
  { to: '/', label: 'Главная' },
  { to: '/users', label: 'Пользователи' },
  { to: '/roles', label: 'Роли' },
  { to: '/currencies', label: 'Валюты' },
  { to: '/accounts', label: 'Счета' },
  { to: '/operations', label: 'Операции' },
  { to: '/about', label: 'О проекте' },
] as const

const desktopNavListClassName =
  'm-0 flex list-none items-center justify-center gap-1 p-0'

const desktopNavLinkClassName =
  'inline-flex h-9 items-center justify-center whitespace-nowrap rounded-full border border-transparent px-3 text-sm leading-none font-semibold text-(--sea-ink-soft) no-underline transition-[background-color,color,border-color] duration-200 hover:text-(--sea-ink) hover:border-(--chip-line) hover:bg-(--link-bg-hover) focus-visible:text-(--sea-ink) focus-visible:border-(--chip-line) focus-visible:bg-(--link-bg-hover) [&.is-active]:text-(--sea-ink) [&.is-active]:border-(--chip-line) [&.is-active]:bg-(--link-bg-hover)'

const mobileNavListClassName = 'm-0 flex list-none flex-col gap-1.5 p-0'

const mobileNavLinkClassName =
  'block rounded-xl border border-transparent px-3 py-2.5 text-sm font-semibold text-(--sea-ink-soft) no-underline transition-[background-color,color,border-color] duration-200 hover:text-(--sea-ink) hover:border-(--chip-line) hover:bg-(--link-bg-hover) focus-visible:text-(--sea-ink) focus-visible:border-(--chip-line) focus-visible:bg-(--link-bg-hover) [&.is-active]:text-(--sea-ink) [&.is-active]:border-(--chip-line) [&.is-active]:bg-(--link-bg-hover)'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-(--line) bg-(--header-bg) px-4 backdrop-blur-lg">
      <nav aria-label="Primary" className="page-wrap flex items-center gap-3 py-3 sm:py-4">
        <h2 className="m-0 shrink-0 text-base font-semibold tracking-tight">
          <Link
            to="/"
            className="inline-flex h-9 items-center text-base text-(--sea-ink) no-underline transition-colors hover:text-(--lagoon-deep) sm:text-lg"
          >
            Финансовая консоль
          </Link>
        </h2>

        <div className="hidden min-w-0 flex-1 items-center justify-center md:flex">
          <ul className={desktopNavListClassName}>
            {appLinks.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={desktopNavLinkClassName}
                  activeProps={{ className: `${desktopNavLinkClassName} is-active` }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="md:hidden"
                aria-label="Open navigation menu"
              >
                <MenuIcon />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[86vw] sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>Навигация</SheetTitle>
                <SheetDescription>Выберите раздел финансовой консоли</SheetDescription>
              </SheetHeader>

              <nav aria-label="Mobile primary" className="px-4 pb-6">
                <ul className={mobileNavListClassName}>
                  {appLinks.map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className={mobileNavLinkClassName}
                        activeProps={{ className: `${mobileNavLinkClassName} is-active` }}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
