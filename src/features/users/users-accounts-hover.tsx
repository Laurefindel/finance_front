import { Badge } from '#/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '#/components/ui/tooltip'
import type { UserResponse } from '#/lib/finance/schemas'

interface UsersAccountsHoverProps {
  readonly user: UserResponse
  readonly triggerLabel: string
}

export function UsersAccountsHover({ user, triggerLabel }: UsersAccountsHoverProps) {
  const accountsIds = user.accountsIds ?? []

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex cursor-help items-center rounded-md border border-transparent px-2 py-1 text-left text-sm font-medium text-foreground transition-colors hover:border-border hover:bg-muted/60"
          aria-label={`Информация о пользователе ${user.id ?? ''}`.trim()}
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
            <p className="text-xs font-semibold">
              Пользователь #{user.id ?? '?'}
            </p>
            <Badge variant="secondary">счетов: {accountsIds.length}</Badge>
          </div>

          {accountsIds.length ? (
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-background/85">
                Счета
              </p>
              <ul className="space-y-1.5">
                {accountsIds.map((accountId) => (
                  <li
                    key={accountId}
                    className="rounded-md border border-background/20 bg-background/5 px-2 py-1 text-[11px] text-background"
                  >
                    #{accountId}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-[11px] text-background/80">
              У пользователя пока нет счетов
            </p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
