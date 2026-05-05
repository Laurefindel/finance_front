import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
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
        isAssignPending: model.assignments.isAssignPending,
        isRemovePending: model.assignments.isRemovePending,
        onDelete: model.remove.onDelete,
        onAssign: model.assignments.onAssign,
        onRemove: model.assignments.onRemove,
        users: model.users,
      }),
    [
      model.assignments.isAssignPending,
      model.assignments.isRemovePending,
      model.assignments.onAssign,
      model.assignments.onRemove,
      model.remove.isPending,
      model.remove.onDelete,
      model.users,
    ],
  )

  return (
    <main className="page-wrap space-y-6 px-4 py-8">
      <PageHeaderSection
        kicker="Роли"
        title="Роли"
      />

      <RolesTableCard
        columns={columns}
        data={model.rows}
        errorMessage={model.rowsErrorMessage}
        headerAction={
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">Создать роль</Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Новая роль</DialogTitle>
              </DialogHeader>
              <RolesCreateCard
                value={model.form}
                onChange={model.setForm}
                onApply={model.onApply}
                isPending={model.isSubmitPending}
              />
            </DialogContent>
          </Dialog>
        }
      />
    </main>
  )
}
