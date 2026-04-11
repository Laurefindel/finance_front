import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import type { FormCardProps } from '#/features/shared/contracts'
import type { CreateCurrencyFormState } from './types'

interface CurrenciesCreateCardProps
  extends FormCardProps<CreateCurrencyFormState> {}

export function CurrenciesCreateCard({
  value,
  onChange,
  onApply,
  isPending,
}: CurrenciesCreateCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Создать валюту</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onApply}>
          <div className="space-y-2">
            <Label htmlFor="currencyCode">Код (3 символа)</Label>
            <Input
              id="currencyCode"
              maxLength={3}
              value={value.code}
              onChange={(event) =>
                onChange((prev) => ({ ...prev, code: event.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currencyName">Название</Label>
            <Input
              id="currencyName"
              value={value.name}
              onChange={(event) =>
                onChange((prev) => ({ ...prev, name: event.target.value }))
              }
              required
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Сохранение...' : 'Создать'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
