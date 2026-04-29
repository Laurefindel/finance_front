import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import type { FormCardProps } from '#/features/shared/contracts'
import type { AccountResponse } from '#/lib/finance/schemas'
import type { AsyncReplenishFormState } from './types'

interface AsyncReplenishStartCardProps
  extends FormCardProps<AsyncReplenishFormState> {
  accounts: AccountResponse[]
}

function formatAccountLabel(account: AccountResponse) {
  const owner = `${account.user?.firstName ?? ''} ${
    account.user?.lastName ?? ''
  }`.trim()
  const currency = account.currency?.code?.trim().toUpperCase() || '---'
  const balance =
    typeof account.balance === 'number'
      ? account.balance.toFixed(2)
      : '-'

  return `${owner || 'Без владельца'} · ${currency} · ${balance}`
}

export function AsyncReplenishStartCard({
  value,
  onChange,
  onApply,
  isPending,
  accounts,
}: Readonly<AsyncReplenishStartCardProps>) {
  const normalizedAccounts = accounts.filter(
    (account) => typeof account.id === 'number',
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Запуск задачи</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={onApply}>
          <div className="space-y-2">
            <Label htmlFor="asyncAccountId">Счет</Label>
            <Select
              value={value.accountId || 'none'}
              onValueChange={(nextValue) =>
                onChange((prev) => ({
                  ...prev,
                  accountId: nextValue === 'none' ? '' : nextValue,
                }))
              }
            >
              <SelectTrigger id="asyncAccountId" className="w-full">
                <SelectValue placeholder="Выберите счет" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Не выбрано</SelectItem>
                {normalizedAccounts.map((account) => (
                  <SelectItem key={account.id} value={String(account.id)}>
                    {formatAccountLabel(account)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
