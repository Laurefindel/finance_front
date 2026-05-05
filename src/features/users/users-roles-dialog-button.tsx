import { useMemo, useState } from 'react'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import type { Role, UserResponse } from '#/lib/finance/schemas'

interface UsersRolesDialogProps {
  readonly user: UserResponse | null
  readonly roles: Role[]
  readonly onAssign: (userId: number, roleId: number) => Promise<void>
  readonly onRemove: (userId: number, roleId: number) => Promise<void>
  readonly isAssignPending: boolean
  readonly isRemovePending: boolean
  readonly isOpen: boolean
  readonly onOpenChange: (isOpen: boolean) => void
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

function getRoleLabel(role: Role) {
  return role.name ?? 'Без названия'
}

export function UsersRolesDialog({
  user,
  roles,
  onAssign,
  onRemove,
  isAssignPending,
  isRemovePending,
  isOpen,
  onOpenChange,
}: UsersRolesDialogProps) {
  const userId = user?.id
  const [selectedRoleId, setSelectedRoleId] = useState('')

  const assignedRoles = useMemo(() => {
    if (typeof userId !== 'number') {
      return []
    }

    if (roles.length) {
      return roles.filter((role) =>
        typeof role.id === 'number' && user ? hasRole(user, role.id) : false,
      )
    }

    return (user?.roles ?? []).filter((role) => role.name)
  }, [roles, user, userId])

  const availableRoles = useMemo(() => {
    if (typeof userId !== 'number' || !roles.length) {
      return []
    }

    return roles.filter((role) =>
      typeof role.id === 'number' && user ? !hasRole(user, role.id) : false,
    )
  }, [roles, user, userId])

  const handleAssign = async () => {
    if (!userId || !selectedRoleId) {
      return
    }

    await onAssign(userId, Number(selectedRoleId))
    setSelectedRoleId('')
  }

  if (!user) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Роли пользователя «{getUserLabel(user)}»</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-(--line) bg-(--surface-strong) p-4">
            <p className="text-sm font-semibold text-(--sea-ink)">Назначить роль</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                <SelectTrigger className="w-full sm:w-64" size="sm">
                  <SelectValue placeholder="Выберите роль" />
                </SelectTrigger>
                <SelectContent align="start">
                  {availableRoles.length ? (
                    availableRoles.map((role) => (
                      <SelectItem
                        key={String(role.id)}
                        value={String(role.id)}
                      >
                        {getRoleLabel(role)}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-roles" disabled>
                      Нет доступных ролей
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                onClick={handleAssign}
                disabled={!selectedRoleId || !userId || isAssignPending}
              >
                {isAssignPending ? 'Назначение...' : 'Назначить'}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-(--sea-ink)">Назначенные роли</p>
            {assignedRoles.length ? (
              <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-(--line) bg-(--surface-strong) p-3">
                {assignedRoles.map((role) => (
                  <div
                    key={String(role.id ?? role.name ?? 'role')}
                    className="flex items-center justify-between gap-3 rounded-md border border-(--line) bg-background px-3 py-2"
                  >
                    <p className="text-sm font-semibold text-(--sea-ink)">{getRoleLabel(role)}</p>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={!userId || !role.id || isRemovePending}
                      onClick={async () => {
                        if (!userId || !role.id) {
                          return
                        }
                        await onRemove(userId, role.id)
                      }}
                    >
                      {isRemovePending ? 'Удаление...' : 'Снять роль'}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Роли не назначены.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
