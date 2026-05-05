import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { UsersCreateCard } from '#/features/users/users-create-card'
import { UsersRolesDialog } from '#/features/users/users-roles-dialog-button'
import { createUsersTableColumns } from '#/features/users/users-table-columns'
import { UsersTableCard } from '#/features/users/users-table-card'
import { useUsersPageModel } from '#/features/users/use-users-page-model'
import { PageHeaderSection } from '#/features/shared/page-header-section'

export const Route = createFileRoute('/users')({
  component: UsersPage,
})

function UsersPage() {
  const [openRolesUserId, setOpenRolesUserId] = useState<number | null>(null)
  const model = useUsersPageModel({
    onSuccess: (message) => toast.success(message),
    onError: (message) => toast.error(message),
  })

  const selectedUser = useMemo(
    () => model.rows.find((row) => row.id === openRolesUserId) ?? null,
    [model.rows, openRolesUserId],
  )

  const columns = useMemo(
    () =>
      createUsersTableColumns({
        isDeletePending: model.remove.isPending,
        isUpdatePending: model.update.isPending,
        isAssignPending: model.assignments.isAssignPending,
        isRemovePending: model.assignments.isRemovePending,
        setOpenRolesUserId,
        onDelete: model.remove.onDelete,
        onUpdate: model.update.onUpdate,
        onAssign: model.assignments.onAssign,
        onRemove: model.assignments.onRemove,
        roles: model.roles,
      }),
    [
      model.assignments.isAssignPending,
      model.assignments.isRemovePending,
      model.assignments.onAssign,
      model.assignments.onRemove,
      model.remove.isPending,
      model.remove.onDelete,
      model.update.isPending,
      model.update.onUpdate,
      setOpenRolesUserId,
      model.roles,
    ],
  )

  return (
    <main className="page-wrap space-y-6 px-4 py-8">
      <PageHeaderSection
        kicker="Пользователи"
        title="Пользователи"
      />

      <UsersTableCard
        columns={columns}
        data={model.rows}
        errorMessage={model.rowsErrorMessage}
        isInitialLoading={model.isInitialLoading}
        isFatalError={model.isFatalError}
        hasRefreshError={model.hasRefreshError}
        headerAction={
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">Создать пользователя</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Новый пользователь</DialogTitle>
              </DialogHeader>
              <UsersCreateCard
                value={model.form}
                onChange={model.setForm}
                onApply={model.onApply}
                isPending={model.isSubmitPending}
              />
            </DialogContent>
          </Dialog>
        }
      />
      <UsersRolesDialog
        user={selectedUser}
        roles={model.roles}
        onAssign={model.assignments.onAssign}
        onRemove={model.assignments.onRemove}
        isAssignPending={model.assignments.isAssignPending}
        isRemovePending={model.assignments.isRemovePending}
        isOpen={Boolean(selectedUser)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setOpenRolesUserId(null)
          }
        }}
      />
    </main>
  )
}
