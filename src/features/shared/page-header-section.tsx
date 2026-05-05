import { cn } from '#/lib/utils'

interface PageHeaderSectionProps {
  readonly kicker: string
  readonly title: string
  readonly description?: string
  readonly className?: string
  readonly titleClassName?: string
  readonly descriptionClassName?: string
}

export function PageHeaderSection(props: Readonly<PageHeaderSectionProps>) {
  const {
    kicker,
    title,
    description,
    className,
    titleClassName,
    descriptionClassName,
  } = props

  return (
    <header className={cn('space-y-2', className)}>
      <p className="island-kicker">{kicker}</p>

      <h1
        className={cn(
          'display-title text-4xl font-bold text-(--sea-ink)',
          titleClassName,
        )}
      >
        {title}
      </h1>

      {description ? (
        <p
          className={cn(
            'text-sm text-(--sea-ink-soft)',
            descriptionClassName,
          )}
        >
          {description}
        </p>
      ) : null}
    </header>
  )
}