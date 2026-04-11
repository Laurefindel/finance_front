import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import type { FormCardProps } from '#/features/shared/contracts'
import type { CreateRoleFormState } from './types'

interface RolesCreateCardProps extends FormCardProps<CreateRoleFormState> {}

export function RolesCreateCard({
  value,
  onChange,
  onApply,
  isPending,
}: RolesCreateCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Создать роль</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4 sm:flex-row" onSubmit={onApply}>
          <div className="flex-1 space-y-2">
            <Label htmlFor="roleName">Название</Label>
            <Input
              id="roleName"
              value={value.name}
              onChange={(event) =>
                onChange((prev) => ({ ...prev, name: event.target.value }))
              }
              required
            />
          </div>
          <div className="sm:self-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Сохранение...' : 'Создать'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
