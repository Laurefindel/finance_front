import { TriangleAlertIcon } from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Checkbox } from '#/components/ui/checkbox'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import type { FormCardProps } from '#/features/shared/contracts'
import type { ConcurrencyFormState, ConcurrencyLimits } from './types'

interface ConcurrencyRunCardProps extends FormCardProps<ConcurrencyFormState> {
  limits: ConcurrencyLimits
  estimatedOperations: number
  isHighRiskLoad: boolean
  isCooldownActive: boolean
  cooldownSeconds: number
}

export function ConcurrencyRunCard({
  value,
  onChange,
  onApply,
  isPending,
  limits,
  estimatedOperations,
  isHighRiskLoad,
  isCooldownActive,
  cooldownSeconds,
}: ConcurrencyRunCardProps) {
  const needsAgreement = !value.acknowledgedRisk

  const isRunDisabled = isPending || isCooldownActive || needsAgreement

  const submitLabel = isPending
    ? 'Выполнение...'
    : isCooldownActive
      ? `Пауза ${cooldownSeconds}с`
      : needsAgreement
        ? 'Подтвердите согласие'
        : 'Запустить'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Запуск теста</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm">
          <p className="flex items-center gap-2 font-medium text-destructive">
            <TriangleAlertIcon className="size-4" />
            Нагрузочный тест может перегрузить backend
          </p>
          <p className="mt-1 text-muted-foreground">
            Используйте умеренные параметры и не запускайте тест часто на
            production/staging окружениях.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="outline">threads: {limits.minThreads}-{limits.maxThreads}</Badge>
            <Badge variant="outline">
              increments: {limits.minIncrementsPerThread}-
              {limits.maxIncrementsPerThread}
            </Badge>
            <Badge variant="outline">
              hard limit: {limits.maxTotalOperations.toLocaleString('ru-RU')}
            </Badge>
          </div>
        </div>

        <form className="grid gap-4 md:grid-cols-2" onSubmit={onApply}>
          <div className="space-y-2">
            <Label htmlFor="threads">
              threads ({limits.minThreads}-{limits.maxThreads})
            </Label>
            <Input
              id="threads"
              type="number"
              min={String(limits.minThreads)}
              max={String(limits.maxThreads)}
              step="1"
              inputMode="numeric"
              value={value.threads}
              onChange={(event) =>
                onChange((prev) => ({ ...prev, threads: event.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="increments">incrementsPerThread</Label>
            <Input
              id="increments"
              type="number"
              min={String(limits.minIncrementsPerThread)}
              max={String(limits.maxIncrementsPerThread)}
              step="1"
              inputMode="numeric"
              value={value.incrementsPerThread}
              onChange={(event) =>
                onChange((prev) => ({
                  ...prev,
                  incrementsPerThread: event.target.value,
                }))
              }
              required
            />
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">
              Оценка нагрузки: {estimatedOperations.toLocaleString('ru-RU')} операций
            </p>
            {isHighRiskLoad ? (
              <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
                Высокая нагрузка: потребуется подтверждение риска перед запуском.
              </p>
            ) : null}
          </div>
          <div className="md:col-span-2 rounded-lg border border-border/60 bg-muted/30 p-3">
            <div className="flex items-center gap-2.5">
              <Checkbox
                id="concurrencyRiskAck"
                checked={value.acknowledgedRisk}
                onCheckedChange={(checked) =>
                  onChange((prev) => ({
                    ...prev,
                    acknowledgedRisk: Boolean(checked),
                  }))
                }
              />
              <Label
                htmlFor="concurrencyRiskAck"
                className="cursor-pointer leading-relaxed"
              >
                Подтверждаю риск: запуск теста с большими значениями может привести
                к деградации или недоступности backend.
              </Label>
            </div>
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={isRunDisabled}>
              {submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
