import { Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'

export function DashboardModulesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Дополнительные модули</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Button asChild variant="secondary">
          <Link to="/concurrency">Concurrency Demo</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/about">О проекте</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
