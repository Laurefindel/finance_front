import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import type { FormCardProps } from '#/features/shared/contracts'
import type { AsyncReplenishFormState } from './types'

interface AsyncReplenishStartCardProps
  extends FormCardProps<AsyncReplenishFormState> {}

export function AsyncReplenishStartCard({
  value,
  onChange,
  onApply,
  isPending,
}: AsyncReplenishStartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Запуск задачи</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={onApply}>
          <div className="space-y-2">
            <Label htmlFor="asyncAccountId">ID счета</Label>
            <Input
              id="asyncAccountId"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              value={value.accountId}
              onChange={(event) =>
                onChange((prev) => ({ ...prev, accountId: event.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="asyncAmount">Сумма</Label>
            <Input
              id="asyncAmount"
              type="number"
              min="0"
              step="0.01"
              value={value.amount}
              onChange={(event) =>
                onChange((prev) => ({ ...prev, amount: event.target.value }))
              }
              required
            />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Запуск...' : 'Запустить'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
