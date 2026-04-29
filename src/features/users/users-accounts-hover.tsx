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
            <Badge variant="secondary">счетов: {accountsIds.length}</Badge>
          </div>

          {accountsIds.length ? (
            <p className="text-[11px] text-background/80">
              У пользователя есть активные счета
            </p>
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
