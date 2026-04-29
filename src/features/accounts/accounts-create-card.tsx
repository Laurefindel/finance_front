import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import type { FormCardProps } from '#/features/shared/contracts'
import type { CurrencyResponse, UserResponse } from '#/lib/finance/schemas'
import type { CreateAccountFormState } from './types'

interface AccountsCreateCardProps extends FormCardProps<CreateAccountFormState> {
  users: UserResponse[]
  currencies: CurrencyResponse[]
}

function formatUserLabel(user: UserResponse) {
  const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
  return name || user.email?.trim() || 'Без имени'
}

function formatCurrencyLabel(currency: CurrencyResponse) {
  const code = currency.code?.trim().toUpperCase() || '---'
  const name = currency.name?.trim() || 'Без названия'

  return `${code} — ${name}`
}

export function AccountsCreateCard({
  value,
  onChange,
  onApply,
  isPending,
  users,
  currencies,
}: Readonly<AccountsCreateCardProps>) {
  const normalizedUsers = users.filter((user) => typeof user.id === 'number')
  const normalizedCurrencies = currencies.filter(
    (currency) => typeof currency.id === 'number',
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Создать счет</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onApply}>
          <div className="space-y-2">
            <Label htmlFor="accountUserId">Пользователь</Label>
            <Select
              value={value.userId || 'none'}
              onValueChange={(nextValue) =>
                onChange((prev) => ({
                  ...prev,
                  userId: nextValue === 'none' ? '' : nextValue,
                }))
              }
            >
              <SelectTrigger id="accountUserId" className="w-full">
                <SelectValue placeholder="Выберите пользователя" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Не выбрано</SelectItem>
                {normalizedUsers.map((user) => (
                  <SelectItem key={user.id} value={String(user.id)}>
                    {formatUserLabel(user)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountCurrencyId">Валюта</Label>
            <Select
              value={value.currencyId || 'none'}
              onValueChange={(nextValue) =>
                onChange((prev) => ({
                  ...prev,
                  currencyId: nextValue === 'none' ? '' : nextValue,
                }))
              }
            >
              <SelectTrigger id="accountCurrencyId" className="w-full">
                <SelectValue placeholder="Выберите валюту" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Не выбрано</SelectItem>
                {normalizedCurrencies.map((currency) => {
                  const id = currency.id

                  if (typeof id !== 'number') {
                    return null
                  }

                  return (
                    <SelectItem key={id} value={String(id)}>
                      {formatCurrencyLabel(currency)}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Сохранение...' : 'Создать'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
