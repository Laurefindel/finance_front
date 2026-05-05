import { Badge } from '#/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '#/components/ui/tooltip'
import type { CurrencyResponse } from '#/lib/finance/schemas'

interface CurrenciesInfoHoverProps {
  currency: CurrencyResponse
  label: string
}

function normalizeCode(currency: CurrencyResponse) {
  return currency.code?.trim().toUpperCase() || '---'
}

export function CurrenciesInfoHover({
  currency,
  label,
}: Readonly<CurrenciesInfoHoverProps>) {
  const code = normalizeCode(currency)
  const name = currency.name?.trim() || 'Без названия'
  const currencyId = typeof currency.id === 'number' ? currency.id : null

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex cursor-help items-center rounded-md border border-transparent px-2 py-1 text-left text-sm font-medium text-foreground transition-colors hover:border-border hover:bg-muted/60"
          aria-label="Информация о валюте"
        >
          {label}
        </button>
      </TooltipTrigger>

      <TooltipContent
        side="top"
        sideOffset={8}
        className="w-64 max-w-[calc(100vw-2rem)] rounded-xl p-3 text-left"
      >
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold">Валюта</p>
            <Badge variant="secondary">{code}</Badge>
          </div>

          <p className="text-[11px] text-background/85">{name}</p>

          {currencyId ? (
            <p className="text-[10px] text-background/70">ID: {currencyId}</p>
          ) : null}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
