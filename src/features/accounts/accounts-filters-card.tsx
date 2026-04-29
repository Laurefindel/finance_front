import { type Dispatch, type SetStateAction } from 'react'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import type { AccountsFiltersState } from './types'

interface AccountsFiltersCardProps {
  value: AccountsFiltersState
  onChange: Dispatch<SetStateAction<AccountsFiltersState>>
  onReset: () => void
}

export function AccountsFiltersCard({
  value,
  onChange,
  onReset,
}: AccountsFiltersCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Фильтры</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="filterUserId">ID пользователя</Label>
            <Input
              id="filterUserId"
              value={value.userId}
              onChange={(event) =>
                onChange((prev) => ({ ...prev, userId: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filterCurrency">Код валюты</Label>
            <Input
              id="filterCurrency"
              value={value.currency}
              onChange={(event) =>
                onChange((prev) => ({ ...prev, currency: event.target.value }))
              }
            />
          </div>
          <div className="flex items-end">
            <Button type="button" variant="outline" onClick={onReset}>
              Сбросить фильтры
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
