import { Badge } from '#/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '#/components/ui/tooltip'
import type { UserResponse } from '#/lib/finance/schemas'

interface AccountsOwnerHoverProps {
  user: UserResponse | undefined
}

function getDisplayName(user: UserResponse | undefined) {
  if (!user) {
    return '-'
  }

  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
  return fullName || user.email?.trim() || '-'
}

export function AccountsOwnerHover({
  user,
}: Readonly<AccountsOwnerHoverProps>) {
  if (!user) {
    return <span>-</span>
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex cursor-help items-center rounded-md border border-transparent px-2 py-1 text-left text-sm font-medium text-foreground transition-colors hover:border-border hover:bg-muted/60"
          aria-label="Информация о владельце"
        >
          {getDisplayName(user)}
        </button>
      </TooltipTrigger>

      <TooltipContent
        side="top"
        sideOffset={8}
        className="w-72 max-w-[calc(100vw-2rem)] rounded-xl p-3 text-left"
      >
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold">Владелец счета</p>
            <Badge variant="secondary">{user.status ?? 'N/A'}</Badge>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-medium text-background">
              {getDisplayName(user)}
            </p>
            <p className="text-[11px] text-background/80">
              Email: {user.email ?? '-'}
            </p>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
