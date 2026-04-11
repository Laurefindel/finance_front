import { type Dispatch, type SetStateAction } from 'react'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Textarea } from '#/components/ui/textarea'

interface OperationsBulkCardProps {
  value: string
  onChange: Dispatch<SetStateAction<string>>
  onApplyTransactional: () => void
  onApplyNonTransactional: () => void
  isTransactionalPending: boolean
  isNonTransactionalPending: boolean
}

export function OperationsBulkCard({
  value,
  onChange,
  onApplyTransactional,
  onApplyNonTransactional,
  isTransactionalPending,
  isNonTransactionalPending,
}: OperationsBulkCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk операции</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={8}
        />
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            disabled={isTransactionalPending}
            onClick={onApplyTransactional}
          >
            {isTransactionalPending ? 'Выполнение...' : 'Bulk transactional'}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isNonTransactionalPending}
            onClick={onApplyNonTransactional}
          >
            {isNonTransactionalPending
              ? 'Выполнение...'
              : 'Bulk non-transactional'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
