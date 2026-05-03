import type { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { cn } from '#/lib/utils'

interface PageSummaryCardProps {
  readonly title: string
  readonly className?: string
  readonly contentClassName?: string
  readonly children: ReactNode
}

export function PageSummaryCard(
  props: Readonly<PageSummaryCardProps>,
) {
  const {
    title,
    className,
    contentClassName,
    children,
  } = props

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent
        className={cn(
          'space-y-2 text-sm text-muted-foreground',
          contentClassName,
        )}
      >
        {children}
      </CardContent>
    </Card>
  )
}