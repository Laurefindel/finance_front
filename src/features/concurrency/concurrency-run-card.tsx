import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import type { FormCardProps } from '#/features/shared/contracts'
import type { ConcurrencyFormState } from './types'

interface ConcurrencyRunCardProps extends FormCardProps<ConcurrencyFormState> {}

export function ConcurrencyRunCard({
  value,
  onChange,
  onApply,
  isPending,
}: ConcurrencyRunCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Запуск теста</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={onApply}>
          <div className="space-y-2">
            <Label htmlFor="threads">threads (&gt;= 50)</Label>
            <Input
              id="threads"
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
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Выполнение...' : 'Запустить'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
