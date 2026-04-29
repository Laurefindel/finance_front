import { Badge } from '#/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import type { AsyncTaskStatusTone } from './types'

interface AsyncReplenishStatusCardProps {
  taskId: string
  status: string | null
  message: string | null
  statusTone: AsyncTaskStatusTone
}

export function AsyncReplenishStatusCard({
  taskId,
  status,
  message,
  statusTone,
}: Readonly<AsyncReplenishStatusCardProps>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Статус задачи</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {taskId ? (
          <>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Статус:</span>
              <Badge variant={statusTone}>{status ?? 'PENDING'}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {message ?? 'Ожидание статуса...'}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Сначала запустите задачу пополнения.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
