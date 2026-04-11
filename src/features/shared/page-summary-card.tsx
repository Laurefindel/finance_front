import type { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { cn } from '#/lib/utils'

interface PageSummaryCardProps {
  title: string
  className?: string
  contentClassName?: string
  children: ReactNode
}

export function PageSummaryCard({
  title,
  className,
  contentClassName,
  children,
}: PageSummaryCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className={cn('space-y-2 text-sm text-muted-foreground', contentClassName)}>
        {children}
      </CardContent>
    </Card>
  )
}
