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
import type { ReplenishAccountFormState } from './types'

interface AccountsReplenishCardProps
  extends FormCardProps<ReplenishAccountFormState> {
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

export function AccountsReplenishCard({
  value,
  onChange,
  onApply,
  isPending,
  accounts,
}: Readonly<AccountsReplenishCardProps>) {
  const normalizedAccounts = accounts.filter(
    (account) => typeof account.id === 'number',
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Пополнить счет</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onApply}>
          <div className="space-y-2">
            <Label htmlFor="replenishId">Счет</Label>
            <Select
              value={value.id || 'none'}
              onValueChange={(nextValue) =>
                onChange((prev) => ({
                  ...prev,
                  id: nextValue === 'none' ? '' : nextValue,
                }))
              }
            >
              <SelectTrigger id="replenishId" className="w-full">
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
