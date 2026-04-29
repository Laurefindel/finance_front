import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import type { FormCardProps } from '#/features/shared/contracts'
import type { ReplenishAccountFormState } from './types'

interface AccountsReplenishCardProps
  extends FormCardProps<ReplenishAccountFormState> {}

export function AccountsReplenishCard({
  value,
  onChange,
  onApply,
  isPending,
}: AccountsReplenishCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Пополнить счет</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onApply}>
          <div className="space-y-2">
            <Label htmlFor="replenishId">ID счета</Label>
            <Input
              id="replenishId"
              value={value.id}
              onChange={(event) =>
                onChange((prev) => ({ ...prev, id: event.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="replenishAmount">Сумма пополнения</Label>
            <Input
              id="replenishAmount"
              type="number"
              step="0.01"
              min="0"
              value={value.amount}
              onChange={(event) =>
                onChange((prev) => ({ ...prev, amount: event.target.value }))
              }
              required
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Выполнение...' : 'Пополнить'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
