import { Badge } from '#/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '#/components/ui/tooltip'

interface OperationsCurrencyHoverProps {
  code?: string | null
  name?: string | null
}

function normalizeCode(code: string | null | undefined) {
  return code?.trim().toUpperCase() || ''
}

export function OperationsCurrencyHover({
  code,
  name,
}: Readonly<OperationsCurrencyHoverProps>) {
  const normalizedCode = normalizeCode(code)
  const currencyName = name?.trim() || 'Без названия'

  if (!normalizedCode && !name) {
    return <span>-</span>
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex cursor-help items-center rounded-md border border-transparent px-2 py-1 text-sm font-medium text-foreground transition-colors hover:border-border hover:bg-muted/60"
          aria-label="Информация о валюте"
        >
          {normalizedCode || '---'}
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={8}
        className="w-64 max-w-[calc(100vw-2rem)] rounded-xl p-3 text-left"
      >
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold">Валюта операции</p>
            <Badge variant="secondary">{normalizedCode || '---'}</Badge>
          </div>
          <p className="text-[11px] text-background/85">{currencyName}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
