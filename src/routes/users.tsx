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
import { UsersCreateCard } from '#/features/users/users-create-card'
import { createUsersTableColumns } from '#/features/users/users-table-columns'
import { UsersTableCard } from '#/features/users/users-table-card'
import { useUsersPageModel } from '#/features/users/use-users-page-model'
import { PageHeaderSection } from '#/features/shared/page-header-section'

export const Route = createFileRoute('/users')({
  component: UsersPage,
})

function UsersPage() {
  const model = useUsersPageModel({
    onSuccess: (message) => toast.success(message),
    onError: (message) => toast.error(message),
  })

  const columns = useMemo(
    () =>
      createUsersTableColumns({
        isDeletePending: model.remove.isPending,
        isUpdatePending: model.update.isPending,
        onDelete: model.remove.onDelete,
        onUpdate: model.update.onUpdate,
      }),
    [
      model.remove.isPending,
      model.remove.onDelete,
      model.update.isPending,
      model.update.onUpdate,
    ],
  )

  return (
    <main className="page-wrap space-y-6 px-4 py-8">
      <PageHeaderSection
        kicker="Пользователи"
        title="Пользователи"
        description="Регистрация и управление пользователями Finance API."
      />

      <UsersTableCard
        columns={columns}
        data={model.rows}
        errorMessage={model.rowsErrorMessage}
        isInitialLoading={model.isInitialLoading}
        isFatalError={model.isFatalError}
        hasRefreshError={model.hasRefreshError}
        footerAction={
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
    </main>
  )
}
