import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import type { FormCardProps } from '#/features/shared/contracts'
import type { OperationCreateFormState } from './types'

interface OperationsCreateCardProps
  extends FormCardProps<OperationCreateFormState> {}

export function OperationsCreateCard({
  value,
  onChange,
  onApply,
  isPending,
}: OperationsCreateCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Создать операцию</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={onApply}>
          <div className="space-y-2">
            <Label>senderAccountId</Label>
            <Input
              value={value.senderAccountId}
              onChange={(event) =>
                onChange((prev) => ({
                  ...prev,
                  senderAccountId: event.target.value,
                }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>receiverAccountId</Label>
            <Input
              value={value.receiverAccountId}
              onChange={(event) =>
                onChange((prev) => ({
                  ...prev,
                  receiverAccountId: event.target.value,
                }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>amount</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={value.amount}
              onChange={(event) =>
                onChange((prev) => ({
                  ...prev,
                  amount: event.target.value,
                }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>description</Label>
            <Input
              value={value.description}
              onChange={(event) =>
                onChange((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
            />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Сохранение...' : 'Создать'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
