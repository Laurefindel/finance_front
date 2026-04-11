import { createFileRoute } from '@tanstack/react-router'
import { UsersCreateCard } from '#/features/users/users-create-card'
import { UsersTableCard } from '#/features/users/users-table-card'
import { useUsersPageModel } from '#/features/users/use-users-page-model'
import { PageHeaderSection } from '#/features/shared/page-header-section'

export const Route = createFileRoute('/users')({
  component: UsersPage,
})

function UsersPage() {
  const model = useUsersPageModel()

  return (
    <main className="page-wrap space-y-6 px-4 py-8">
      <PageHeaderSection
        kicker="Users"
        title="Пользователи"
        description="Регистрация и управление пользователями Finance API."
      />

      <UsersCreateCard
        value={model.form}
        onChange={model.setForm}
        onApply={model.onApply}
        isPending={model.isSubmitPending}
      />

      <UsersTableCard
        columns={model.columns}
        data={model.rows}
        errorMessage={model.rowsErrorMessage}
        isInitialLoading={model.isInitialLoading}
        isFatalError={model.isFatalError}
        hasRefreshError={model.hasRefreshError}
      />
    </main>
  )
}
