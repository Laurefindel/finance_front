import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import type { FormCardProps } from '#/features/shared/contracts'
import type { UserFormState } from './types'

interface UsersCreateCardProps
  extends Readonly<FormCardProps<UserFormState>> {}

export function UsersCreateCard(
  props: Readonly<UsersCreateCardProps>,
) {
  const { value, onChange, onApply, isPending } = props

  return (
    <Card>
      <CardHeader>
        <CardTitle>Создать пользователя</CardTitle>
      </CardHeader>

      <CardContent>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={onApply}>
          <div className="space-y-2">
            <Label htmlFor="firstName">Имя</Label>
            <Input
              id="firstName"
              value={value.firstName}
              onChange={(event) =>
                onChange((prev) => ({
                  ...prev,
                  firstName: event.target.value,
                }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Фамилия</Label>
            <Input
              id="lastName"
              value={value.lastName}
              onChange={(event) =>
                onChange((prev) => ({
                  ...prev,
                  lastName: event.target.value,
                }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={value.email}
              onChange={(event) =>
                onChange((prev) => ({
                  ...prev,
                  email: event.target.value,
                }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={value.password}
              onChange={(event) =>
                onChange((prev) => ({
                  ...prev,
                  password: event.target.value,
                }))
              }
              required
            />
          </div>

          <div className="md:col-span-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Сохранение...' : 'Создать'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}