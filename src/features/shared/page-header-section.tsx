import { cn } from '#/lib/utils'

interface PageHeaderSectionProps {
  kicker: string
  title: string
  description: string
  className?: string
  titleClassName?: string
  descriptionClassName?: string
}

export function PageHeaderSection({
  kicker,
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
}: PageHeaderSectionProps) {
  return (
    <header className={cn('space-y-2', className)}>
      <p className="island-kicker">{kicker}</p>
      <h1 className={cn('display-title text-4xl font-bold text-(--sea-ink)', titleClassName)}>
        {title}
      </h1>
      <p className={cn('text-sm text-(--sea-ink-soft)', descriptionClassName)}>
        {description}
      </p>
    </header>
  )
}
