import { type Dispatch, type SetStateAction } from 'react'
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
import type { CurrencyResponse, UserResponse } from '#/lib/finance/schemas'
import type { AccountsFiltersState } from './types'

interface AccountsFiltersCardProps {
  value: AccountsFiltersState
  onChange: Dispatch<SetStateAction<AccountsFiltersState>>
  onReset: () => void
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

export function AccountsFiltersCard({
  value,
  onChange,
  onReset,
  users,
  currencies,
}: Readonly<AccountsFiltersCardProps>) {
  const normalizedUsers = users.filter((user) => typeof user.id === 'number')
  const normalizedCurrencies = currencies.filter(
    (currency) => currency.code?.trim().length,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Фильтры</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="filterUserId">Пользователь</Label>
            <Select
              value={value.userId || 'all'}
              onValueChange={(nextValue) =>
                onChange((prev) => ({
                  ...prev,
                  userId: nextValue === 'all' ? '' : nextValue,
                }))
              }
            >
              <SelectTrigger id="filterUserId" className="w-full">
                <SelectValue placeholder="Любой" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Любой</SelectItem>
                {normalizedUsers.map((user) => (
                  <SelectItem key={user.id} value={String(user.id)}>
                    {formatUserLabel(user)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="filterCurrency">Валюта</Label>
            <Select
              value={value.currency || 'all'}
              onValueChange={(nextValue) =>
                onChange((prev) => ({
                  ...prev,
                  currency: nextValue === 'all' ? '' : nextValue,
                }))
              }
            >
              <SelectTrigger id="filterCurrency" className="w-full">
                <SelectValue placeholder="Любая" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Любая</SelectItem>
                {normalizedCurrencies.map((currency) => {
                  const code = currency.code?.trim().toUpperCase()

                  if (!code) {
                    return null
                  }

                  return (
                    <SelectItem key={code} value={code}>
                      {formatCurrencyLabel(currency)}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={onReset}>
              Сбросить фильтры
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
