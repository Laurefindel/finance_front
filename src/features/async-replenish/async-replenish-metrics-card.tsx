import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'

interface AsyncReplenishMetricsCardProps {
  submitted: number
  running: number
  succeeded: number
  failed: number
  errorMessage: string | null
}

export function AsyncReplenishMetricsCard({
  submitted,
  running,
  succeeded,
  failed,
  errorMessage,
}: AsyncReplenishMetricsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Метрики очереди</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {errorMessage ? (
          <p className="text-destructive">{errorMessage}</p>
        ) : (
          <>
            <p>Поставлено в очередь: {submitted}</p>
            <p>Выполняется: {running}</p>
            <p>Успешно завершено: {succeeded}</p>
            <p>Завершено с ошибкой: {failed}</p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
