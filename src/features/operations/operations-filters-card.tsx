import { type Dispatch, type SyntheticEvent, type SetStateAction } from 'react'
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
import type { UserResponse } from '#/lib/finance/schemas'
import type { OperationFilterState } from './types'

interface OperationsFiltersCardProps {
  value: OperationFilterState
  onChange: Dispatch<SetStateAction<OperationFilterState>>
  onApply: (event: SyntheticEvent<HTMLFormElement>) => void
  onReset: () => void
  users: UserResponse[]
}

function formatUserLabel(user: UserResponse) {
  const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
  return name || user.email?.trim() || 'Без имени'
}

export function OperationsFiltersCard({
  value,
  onChange,
  onApply,
  onReset,
  users,
}: Readonly<OperationsFiltersCardProps>) {
  const normalizedUsers = users.filter((user) => typeof user.id === 'number')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Фильтры и пагинация</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-3" onSubmit={onApply}>
          <div className="space-y-2">
            <Label>Размер страницы</Label>
            <Input
              value={value.size}
              onChange={(event) =>
                onChange((prev) => ({ ...prev, size: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senderUser">Пользователь-отправитель</Label>
            <Select
              value={value.senderUserId || 'all'}
              onValueChange={(nextValue) =>
                onChange((prev) => ({
                  ...prev,
                  senderUserId: nextValue === 'all' ? '' : nextValue,
                }))
              }
            >
              <SelectTrigger id="senderUser" className="w-full">
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
            <Label htmlFor="receiverUser">Пользователь-получатель</Label>
            <Select
              value={value.receiverUserId || 'all'}
              onValueChange={(nextValue) =>
                onChange((prev) => ({
                  ...prev,
                  receiverUserId: nextValue === 'all' ? '' : nextValue,
                }))
              }
            >
              <SelectTrigger id="receiverUser" className="w-full">
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
            <Label>Код валюты</Label>
            <Input
              value={value.currencyCode}
              onChange={(event) =>
                onChange((prev) => ({
                  ...prev,
                  currencyCode: event.target.value.toUpperCase(),
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Минимальная сумма</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={value.minAmount}
              onChange={(event) =>
                onChange((prev) => ({
                  ...prev,
                  minAmount: event.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Максимальная сумма</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={value.maxAmount}
              onChange={(event) =>
                onChange((prev) => ({
                  ...prev,
                  maxAmount: event.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Дата с</Label>
            <Input
              type="datetime-local"
              value={value.fromDate}
              onChange={(event) =>
                onChange((prev) => ({
                  ...prev,
                  fromDate: event.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Дата по</Label>
            <Input
              type="datetime-local"
              value={value.toDate}
              onChange={(event) =>
                onChange((prev) => ({ ...prev, toDate: event.target.value }))
              }
            />
          </div>
          <div className="md:col-span-3 flex gap-3">
            <Button type="submit">Применить</Button>
            <Button type="button" variant="outline" onClick={onReset}>
              Сбросить
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
