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
import type { OperationCreateFormState } from './types'

interface OperationsCreateCardProps
  extends FormCardProps<OperationCreateFormState> {
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

export function OperationsCreateCard({
  value,
  onChange,
  onApply,
  isPending,
  accounts,
}: Readonly<OperationsCreateCardProps>) {
  const normalizedAccounts = accounts.filter(
    (account) => typeof account.id === 'number',
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Создать операцию</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={onApply}>
          <div className="space-y-2">
            <Label htmlFor="senderAccount">Счет отправителя</Label>
            <Select
              value={value.senderAccountId || 'none'}
              onValueChange={(nextValue) =>
                onChange((prev) => ({
                  ...prev,
                  senderAccountId: nextValue === 'none' ? '' : nextValue,
                }))
              }
            >
              <SelectTrigger id="senderAccount" className="w-full">
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
            <Label htmlFor="receiverAccount">Счет получателя</Label>
            <Select
              value={value.receiverAccountId || 'none'}
              onValueChange={(nextValue) =>
                onChange((prev) => ({
                  ...prev,
                  receiverAccountId: nextValue === 'none' ? '' : nextValue,
                }))
              }
            >
              <SelectTrigger id="receiverAccount" className="w-full">
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
            <Label>Сумма</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={value.amount}
              onChange={(event) =>
                onChange((prev) => ({
                  ...prev,
                  amount: event.target.value,
                }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Описание</Label>
            <Input
              value={value.description}
              onChange={(event) =>
                onChange((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
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
