import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { RolesCreateCard } from '#/features/roles/roles-create-card'
import { createRolesTableColumns } from '#/features/roles/roles-table-columns'
import { RolesTableCard } from '#/features/roles/roles-table-card'
import { useRolesPageModel } from '#/features/roles/use-roles-page-model'
import { PageHeaderSection } from '#/features/shared/page-header-section'

export const Route = createFileRoute('/roles')({
  component: RolesPage,
})

function RolesPage() {
  const model = useRolesPageModel({
    onSuccess: (message) => toast.success(message),
    onError: (message) => toast.error(message),
  })

  const columns = useMemo(
    () =>
      createRolesTableColumns({
        isDeletePending: model.remove.isPending,
        onDelete: model.remove.onDelete,
      }),
    [model.remove.isPending, model.remove.onDelete],
  )

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
        columns={columns}
        data={model.rows}
        errorMessage={model.rowsErrorMessage}
      />
    </main>
  )
}
