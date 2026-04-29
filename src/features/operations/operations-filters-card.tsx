import { type Dispatch, type FormEvent, type SetStateAction } from 'react'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import type { OperationFilterState } from './types'

interface OperationsFiltersCardProps {
  value: OperationFilterState
  onChange: Dispatch<SetStateAction<OperationFilterState>>
  onApply: (event: FormEvent<HTMLFormElement>) => void
  onReset: () => void
}

export function OperationsFiltersCard({
  value,
  onChange,
  onApply,
  onReset,
}: OperationsFiltersCardProps) {
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
            <Label>ID пользователя-отправителя</Label>
            <Input
              value={value.senderUserId}
              onChange={(event) =>
                onChange((prev) => ({
                  ...prev,
                  senderUserId: event.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>ID пользователя-получателя</Label>
            <Input
              value={value.receiverUserId}
              onChange={(event) =>
                onChange((prev) => ({
                  ...prev,
                  receiverUserId: event.target.value,
                }))
              }
            />
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
