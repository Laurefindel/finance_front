import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import type { AccountResponse } from '#/lib/finance/schemas'

interface AccountsReplenishMenuProps {
  account: AccountResponse
  onOpenReplenish: (accountId: number) => void
  onOpenAsync: (accountId: number) => void
}

export function AccountsReplenishMenu({
  account,
  onOpenReplenish,
  onOpenAsync,
}: Readonly<AccountsReplenishMenuProps>) {
  const id = account.id
  const hasId = typeof id === 'number'

  const openReplenish = () => {
    if (!hasId) {
      return
    }

    onOpenReplenish(id)
  }

  const openAsync = () => {
    if (!hasId) {
      return
    }

    onOpenAsync(id)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={!hasId}>
          Пополнить
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={openReplenish}>
          Обычное пополнение
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={openAsync}>
          Асинхронное пополнение
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
