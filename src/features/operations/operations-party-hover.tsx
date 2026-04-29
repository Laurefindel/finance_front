import { Badge } from '#/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '#/components/ui/tooltip'
import type { AccountResponse, UserResponse } from '#/lib/finance/schemas'

interface OperationsPartyHoverProps {
  readonly accountId: number | undefined
  readonly account?: AccountResponse
  readonly user?: UserResponse
  readonly label: string
}

function formatBalance(balance: number | undefined) {
  if (typeof balance !== 'number') {
    return '-'
  }

  return balance.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function getDisplayName(user: UserResponse | undefined) {
  if (!user) {
    return '-'
  }

  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
  return fullName || '-'
}

export function OperationsPartyHover({
  accountId,
  account,
  user,
  label,
}: OperationsPartyHoverProps) {
  if (typeof accountId !== 'number') {
    return <span>-</span>
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex cursor-help items-center rounded-md border border-transparent px-2 py-1 text-sm font-medium text-foreground transition-colors hover:border-border hover:bg-muted/60"
          aria-label={`Информация о ${label.toLowerCase()}е ${accountId}`}
        >
          #{accountId}
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={8}
        className="w-80 max-w-[calc(100vw-2rem)] rounded-xl p-3 text-left"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold">
              {label}: счет #{accountId}
            </p>
            <Badge variant="secondary">{account?.currency?.code ?? '-'}</Badge>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-wide text-background/80">
              Пользователь
            </p>
            <p className="text-[11px] font-medium text-background">
              {getDisplayName(user)}
            </p>
            <p className="text-[11px] text-background/80">Email: {user?.email ?? '-'}</p>
            <p className="text-[11px] text-background/80">
              Статус: {user?.status ?? 'N/A'}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-wide text-background/80">
              Счет
            </p>
            <p className="text-[11px] text-background/80">
              Баланс: {formatBalance(account?.balance)}
            </p>
            <p className="text-[11px] text-background/80">
              Валюта: {account?.currency?.name ?? account?.currency?.code ?? '-'}
            </p>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
