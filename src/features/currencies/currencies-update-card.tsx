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
import type { CurrencyResponse } from '#/lib/finance/schemas'
import type { UpdateCurrencyFormState } from './types'

interface CurrenciesUpdateCardProps
  extends FormCardProps<UpdateCurrencyFormState> {
  currencies: CurrencyResponse[]
}

function formatCurrencyLabel(currency: CurrencyResponse) {
  const code = currency.code?.trim().toUpperCase() || '---'
  const name = currency.name?.trim() || 'Без названия'

  return `${code} — ${name}`
}

export function CurrenciesUpdateCard({
  value,
  onChange,
  onApply,
  isPending,
  currencies,
}: Readonly<CurrenciesUpdateCardProps>) {
  const normalizedCurrencies = currencies.filter(
    (currency) => currency.code?.trim().length,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Обновить валюту</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onApply}>
          <div className="space-y-2">
            <Label htmlFor="currencyCurrentCode">Текущая валюта</Label>
            <Select
              value={value.currentCode || 'none'}
              onValueChange={(currentCode) => {
                if (currentCode === 'none') {
                  onChange((prev) => ({
                    ...prev,
                    currentCode: '',
                  }))
                  return
                }

                const selected = normalizedCurrencies.find(
                  (currency) =>
                    currency.code?.trim().toUpperCase() === currentCode,
                )

                onChange((prev) => ({
                  ...prev,
                  currentCode,
                  code: selected?.code?.trim().toUpperCase() ?? prev.code,
                  name: selected?.name?.trim() ?? prev.name,
                }))
              }}
            >
              <SelectTrigger id="currencyCurrentCode" className="w-full">
                <SelectValue placeholder="Выберите валюту" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Не выбрано</SelectItem>
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
