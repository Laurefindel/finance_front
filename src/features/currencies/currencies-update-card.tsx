import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import type { FormCardProps } from '#/features/shared/contracts'
import type { UpdateCurrencyFormState } from './types'

interface CurrenciesUpdateCardProps
  extends FormCardProps<UpdateCurrencyFormState> {}

export function CurrenciesUpdateCard({
  value,
  onChange,
  onApply,
  isPending,
}: CurrenciesUpdateCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Обновить валюту</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onApply}>
          <div className="space-y-2">
            <Label htmlFor="currencyId">ID валюты</Label>
            <Input
              id="currencyId"
              inputMode="numeric"
              value={value.id}
              onChange={(event) =>
                onChange((prev) => ({ ...prev, id: event.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currencyCodeUpdate">Новый код</Label>
            <Input
              id="currencyCodeUpdate"
              maxLength={3}
              value={value.code}
              onChange={(event) =>
                onChange((prev) => ({ ...prev, code: event.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currencyNameUpdate">Новое название</Label>
            <Input
              id="currencyNameUpdate"
              value={value.name}
              onChange={(event) =>
                onChange((prev) => ({ ...prev, name: event.target.value }))
              }
              required
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Обновление...' : 'Обновить'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
