import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import type { RaceConditionDemo } from '#/lib/finance/schemas'

interface ConcurrencyResultCardProps {
  result: RaceConditionDemo | null
}

export function ConcurrencyResultCard({ result }: ConcurrencyResultCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Результат</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {result ? (
          <>
            <p>threads: {result.threads}</p>
            <p>incrementsPerThread: {result.incrementsPerThread}</p>
            <p>expected: {result.expected}</p>
            <p>unsafeCounter: {result.unsafeCounter}</p>
            <p>synchronizedCounter: {result.synchronizedCounter}</p>
            <p>atomicCounter: {result.atomicCounter}</p>
            <p>
              raceConditionDetected:{' '}
              {result.raceConditionDetected ? 'true' : 'false'}
            </p>
          </>
        ) : (
          <p className="text-muted-foreground">Данные появятся после запуска теста.</p>
        )}
      </CardContent>
    </Card>
  )
}
