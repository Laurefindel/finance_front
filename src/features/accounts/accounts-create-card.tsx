import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import type { FormCardProps } from '#/features/shared/contracts'
import type { CreateAccountFormState } from './types'

interface AccountsCreateCardProps extends FormCardProps<CreateAccountFormState> {}

export function AccountsCreateCard({
  value,
  onChange,
  onApply,
  isPending,
}: AccountsCreateCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Создать счет</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onApply}>
          <div className="space-y-2">
            <Label htmlFor="accountUserId">ID пользователя</Label>
            <Input
              id="accountUserId"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              value={value.userId}
              onChange={(event) =>
                onChange((prev) => ({ ...prev, userId: event.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountCurrencyId">ID валюты</Label>
            <Input
              id="accountCurrencyId"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              value={value.currencyId}
              onChange={(event) =>
                onChange((prev) => ({ ...prev, currencyId: event.target.value }))
              }
              required
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Сохранение...' : 'Создать'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
