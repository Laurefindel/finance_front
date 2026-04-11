import { createFileRoute } from '@tanstack/react-router'
import { RolesCreateCard } from '#/features/roles/roles-create-card'
import { RolesTableCard } from '#/features/roles/roles-table-card'
import { useRolesPageModel } from '#/features/roles/use-roles-page-model'
import { PageHeaderSection } from '#/features/shared/page-header-section'

export const Route = createFileRoute('/roles')({
  component: RolesPage,
})

function RolesPage() {
  const model = useRolesPageModel()

  return (
    <main className="page-wrap space-y-6 px-4 py-8">
      <PageHeaderSection
        kicker="Roles"
        title="Роли"
        description="Управление справочником ролей."
      />

      <RolesCreateCard
        value={model.form}
        onChange={model.setForm}
        onApply={model.onApply}
        isPending={model.isSubmitPending}
      />

      <RolesTableCard
        columns={model.columns}
        data={model.rows}
        errorMessage={model.rowsErrorMessage}
      />
    </main>
  )
}
