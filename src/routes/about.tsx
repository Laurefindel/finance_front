import { createFileRoute } from '@tanstack/react-router'
import { PageHeaderSection } from '#/features/shared/page-header-section'
import { PageSummaryCard } from '#/features/shared/page-summary-card'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <main className="page-wrap space-y-6 px-4 py-8">
      <PageHeaderSection
        kicker="About"
        title="О проекте"
        description="Это frontend для Finance API на базе TanStack Start с использованием server functions, TanStack Query, TanStack Table, shadcn/ui и Tailwind CSS v4."
        titleClassName="sm:text-5xl"
        descriptionClassName="max-w-3xl leading-7"
      />

      <PageSummaryCard title="Технический стек">
        <p>React 19.2 + TypeScript strict</p>
        <p>TanStack Start (file-based routing, SSR)</p>
        <p>TanStack Query и TanStack Table</p>
        <p>shadcn/ui + Tailwind CSS v4 (@tailwindcss/vite)</p>
        <p>Bun как package manager и runtime</p>
      </PageSummaryCard>

      <PageSummaryCard title="Интеграция с backend">
        <p>Бэкенд: https://financeapplaurefindel-e0f1853e72fd.herokuapp.com</p>
        <p>Swagger: /swagger-ui/index.html и OpenAPI: /v3/api-docs</p>
        <p>
          Доступ к API реализован через server functions для обхода CORS
          ограничений браузера.
        </p>
      </PageSummaryCard>
    </main>
  )
}
