import { type Dispatch, type FormEvent, type SetStateAction } from 'react'
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
            <Label>Query mode</Label>
            <Select
              value={value.queryType}
              onValueChange={(queryType: 'jpql' | 'criteria') =>
                onChange((prev) => ({ ...prev, queryType }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jpql">jpql</SelectItem>
                <SelectItem value="criteria">criteria</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Page size</Label>
            <Input
              value={value.size}
              onChange={(event) =>
                onChange((prev) => ({ ...prev, size: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>senderUserId</Label>
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
            <Label>receiverUserId</Label>
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
            <Label>currencyCode</Label>
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
            <Label>minAmount</Label>
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
            <Label>maxAmount</Label>
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
            <Label>fromDate</Label>
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
            <Label>toDate</Label>
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
