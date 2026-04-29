import { Badge } from '#/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '#/components/ui/tooltip'
import type { UserAccountSummary, UserTableRow } from './types'

interface UsersAccountsHoverProps {
  readonly user: UserTableRow
  readonly triggerLabel: string
  readonly accountsSummary: UserAccountSummary[]
}

const MAX_VISIBLE_ACCOUNTS = 4

function formatBalance(value: number | undefined) {
  if (typeof value !== 'number') {
    return 'баланс: -'
  }

  return value.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function UsersAccountsHover({
  user,
  triggerLabel,
  accountsSummary,
}: UsersAccountsHoverProps) {
  const accountsIds = user.accountsIds ?? []
  const totalAccounts = accountsSummary.length || accountsIds.length

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex cursor-help items-center rounded-md border border-transparent px-2 py-1 text-left text-sm font-medium text-foreground transition-colors hover:border-border hover:bg-muted/60"
          aria-label="Информация о пользователе"
        >
          {triggerLabel}
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={8}
        className="w-72 max-w-[calc(100vw-2rem)] rounded-xl p-3 text-left"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold">Пользователь</p>
            <Badge variant="secondary">счетов: {totalAccounts}</Badge>
          </div>

          {accountsSummary.length ? (
            <ul className="space-y-1.5">
              {accountsSummary.slice(0, MAX_VISIBLE_ACCOUNTS).map((account) => (
                <li
                  key={account.id}
                  className="rounded-md border border-background/20 bg-background/5 px-2 py-1"
                >
                  <p className="text-[11px] font-medium text-background">
                    Счет #{account.id} · {account.currencyCode}
                  </p>
                  <p className="text-[10px] text-background/75">
                    {formatBalance(account.balance)} · {account.currencyName}
                  </p>
                </li>
              ))}
            </ul>
          ) : accountsIds.length ? (
            <p className="text-[11px] text-background/80">
              Счета: {accountsIds.join(', ')}
            </p>
          ) : (
            <p className="text-[11px] text-background/80">
              У пользователя пока нет счетов
            </p>
          )}

          {accountsSummary.length > MAX_VISIBLE_ACCOUNTS ? (
            <p className="text-[10px] text-background/70">
              И еще {accountsSummary.length - MAX_VISIBLE_ACCOUNTS}
            </p>
          ) : null}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
