import { Badge } from '#/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '#/components/ui/tooltip'
import type { FinancialOperationResponse } from '#/lib/finance/schemas'

const MAX_VISIBLE_OPERATIONS = 5

interface AccountsOperationsHoverProps {
  triggerLabel: string
  title: string
  items: FinancialOperationResponse[]
  emptyText: string
  ariaLabel?: string
}

function formatOperationAmount(operation: FinancialOperationResponse) {
  if (typeof operation.amount !== 'number') {
    return '-'
  }

  return operation.amount.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function operationKey(operation: FinancialOperationResponse, index: number) {
  if (typeof operation.id === 'number') {
    return String(operation.id)
  }

  return `${operation.senderAccountId ?? 'na'}-${operation.receiverAccountId ?? 'na'}-${index}`
}

function OperationsList({
  title,
  items,
  emptyText,
}: Readonly<Pick<AccountsOperationsHoverProps, 'title' | 'items' | 'emptyText'>>) {
  const visibleItems = items.slice(0, MAX_VISIBLE_OPERATIONS)

  return (
    <section className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-background/85">
        {title}
      </p>
      {visibleItems.length ? (
        <ul className="space-y-1.5">
          {visibleItems.map((operation, index) => (
            <li
              key={operationKey(operation, index)}
              className="rounded-md border border-background/20 bg-background/5 px-2 py-1"
            >
              <p className="text-[11px] font-medium leading-tight text-background">
                Перевод
              </p>
              <p className="text-[11px] leading-tight text-background/80">
                {formatOperationAmount(operation)} {operation.currencyCode ?? ''}
              </p>
              {operation.description ? (
                <p className="truncate text-[10px] text-background/70">
                  {operation.description}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[11px] text-background/70">{emptyText}</p>
      )}
      {items.length > MAX_VISIBLE_OPERATIONS ? (
        <p className="text-[10px] text-background/70">
          И еще {items.length - MAX_VISIBLE_OPERATIONS}
        </p>
      ) : null}
    </section>
  )
}

export function AccountsOperationsHover({
  triggerLabel,
  title,
  items,
  emptyText,
  ariaLabel = 'Просмотреть операции по счету',
}: Readonly<AccountsOperationsHoverProps>) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex cursor-help items-center gap-1 rounded-md border border-transparent px-2 py-1 text-sm font-medium text-foreground transition-colors hover:border-border hover:bg-muted/60"
          aria-label={ariaLabel}
        >
          <span>{triggerLabel}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={8}
        className="w-80 max-w-[calc(100vw-2rem)] rounded-xl p-3 text-left"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold">{title}</p>
            <Badge variant="secondary">всего: {items.length}</Badge>
          </div>

          <OperationsList title={title} items={items} emptyText={emptyText} />
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
