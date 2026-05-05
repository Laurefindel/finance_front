import { useMemo, useState } from 'react'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import type { Role, UserResponse } from '#/lib/finance/schemas'

interface RolesUsersDialogButtonProps {
  readonly role: Role
  readonly users: UserResponse[]
  readonly onAssign: (userId: number, roleId: number) => Promise<void>
  readonly onRemove: (userId: number, roleId: number) => Promise<void>
  readonly isAssignPending: boolean
  readonly isRemovePending: boolean
}

function hasRole(user: UserResponse, roleId: number) {
  if (user.roles?.some((role) => role.id === roleId)) {
    return true
  }

  return user.roleIds?.includes(roleId) ?? false
}

function getUserLabel(user: UserResponse) {
  const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
  return name || user.email || 'Без имени'
}

export function RolesUsersDialogButton({
  role,
  users,
  onAssign,
  onRemove,
  isAssignPending,
  isRemovePending,
}: RolesUsersDialogButtonProps) {
  const roleId = role.id
  const [selectedUserId, setSelectedUserId] = useState('')

  const assignedUsers = useMemo(() => {
    if (typeof roleId !== 'number') {
      return []
    }

    return users.filter((user) => typeof user.id === 'number' && hasRole(user, roleId))
  }, [users, roleId])

  const availableUsers = useMemo(() => {
    if (typeof roleId !== 'number') {
      return []
    }

    return users.filter(
      (user) => typeof user.id === 'number' && !hasRole(user, roleId),
    )
  }, [users, roleId])

  const handleAssign = async () => {
    if (!roleId || !selectedUserId) {
      return
    }

    await onAssign(Number(selectedUserId), roleId)
    setSelectedUserId('')
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Пользователи
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Пользователи роли «{role.name ?? 'Без названия'}»</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-(--line) bg-(--surface-strong) p-4">
            <p className="text-sm font-semibold text-(--sea-ink)">Назначить роль</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger className="w-full sm:w-64" size="sm">
                  <SelectValue placeholder="Выберите пользователя" />
                </SelectTrigger>
                <SelectContent align="start">
                  {availableUsers.length ? (
                    availableUsers.map((user) => (
                      <SelectItem
                        key={String(user.id)}
                        value={String(user.id)}
                      >
                        {getUserLabel(user)}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-users" disabled>
                      Нет доступных пользователей
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                onClick={handleAssign}
                disabled={!selectedUserId || !roleId || isAssignPending}
              >
                {isAssignPending ? 'Назначение...' : 'Назначить'}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-(--sea-ink)">Назначенные пользователи</p>
            {assignedUsers.length ? (
              <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-(--line) bg-(--surface-strong) p-3">
                {assignedUsers.map((user) => (
                  <div
                    key={String(user.id)}
                    className="flex items-center justify-between gap-3 rounded-md border border-(--line) bg-background px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-semibold text-(--sea-ink)">
                        {getUserLabel(user)}
                      </p>
                      {user.email ? (
                        <p className="text-xs text-(--sea-ink-soft)">{user.email}</p>
                      ) : null}
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={!roleId || !user.id || isRemovePending}
                      onClick={async () => {
                        if (!roleId || !user.id) {
                          return
                        }
                        await onRemove(user.id, roleId)
                      }}
                    >
                      {isRemovePending ? 'Удаление...' : 'Снять роль'}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Пользователей с этой ролью пока нет.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
