import { type Dispatch, type SetStateAction } from 'react'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import type { AccountResponse, UserResponse } from '#/lib/finance/schemas'
import {
  type BulkOperationItemState,
  type BulkOperationsFormState,
  createBulkOperationItem,
} from './types'

interface OperationsBulkCardProps {
  value: BulkOperationsFormState
  onChange: Dispatch<SetStateAction<BulkOperationsFormState>>
  onApply: () => void
  isPending: boolean
  accounts: AccountResponse[]
  users: UserResponse[]
}

function formatAccountLabel(account: AccountResponse) {
  const owner = `${account.user?.firstName ?? ''} ${
    account.user?.lastName ?? ''
  }`.trim()
  const currency = account.currency?.code?.trim().toUpperCase() || '---'
  const balance =
    typeof account.balance === 'number' ? account.balance.toFixed(2) : '-'

  return `${owner || 'Без владельца'} · ${currency} · ${balance}`
}

function formatUserLabel(user: UserResponse) {
  const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
  const email = user.email?.trim() || '—'

  return `${name || 'Без имени'} · ${email}`
}

export function OperationsBulkCard({
  value,
  onChange,
  onApply,
  isPending,
  accounts,
  users,
}: Readonly<OperationsBulkCardProps>) {
  const senderUserId = Number(value.senderUserId)
  const senderAccountId = Number(value.senderAccountId)
  const normalizedAccounts = accounts.filter(
    (account) => typeof account.id === 'number',
  )
  const normalizedUsers = users.filter((user) => typeof user.id === 'number')
  const senderAccounts =
    Number.isFinite(senderUserId) && senderUserId > 0
      ? normalizedAccounts.filter(
          (account) => account.user?.id === senderUserId,
        )
      : []
  const receiverAccounts = normalizedAccounts.filter(
    (account) => account.id !== senderAccountId,
  )

  const onSenderUserChange = (nextValue: string) => {
    onChange((prev) => ({
      ...prev,
      senderUserId: nextValue === 'none' ? '' : nextValue,
      senderAccountId: '',
    }))
  }

  const onSenderAccountChange = (nextValue: string) => {
    onChange((prev) => ({
      ...prev,
      senderAccountId: nextValue === 'none' ? '' : nextValue,
    }))
  }

  const updateItem = (index: number, patch: Partial<BulkOperationItemState>) => {
    onChange((prev) => ({
      ...prev,
      items: prev.items.map((current, itemIndex) =>
        itemIndex === index ? { ...current, ...patch } : current,
      ),
    }))
  }

  const onAddRow = () => {
    onChange((prev) => ({
      ...prev,
      items: [...prev.items, createBulkOperationItem()],
    }))
  }

  const onRemoveRow = (index: number) => {
    onChange((prev) => ({
      ...prev,
      items: prev.items.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Массовые операции</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault()
            onApply()
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="bulkSenderUser">Отправитель</Label>
            <Select
              value={value.senderUserId || 'none'}
              onValueChange={onSenderUserChange}
            >
              <SelectTrigger id="bulkSenderUser" className="w-full">
                <SelectValue placeholder="Выберите пользователя" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Не выбрано</SelectItem>
                {normalizedUsers.map((user) => (
                  <SelectItem key={user.id} value={String(user.id)}>
                    {formatUserLabel(user)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bulkSenderAccount">Счет отправителя</Label>
            <Select
              value={value.senderAccountId || 'none'}
              onValueChange={onSenderAccountChange}
              disabled={!value.senderUserId}
            >
              <SelectTrigger id="bulkSenderAccount" className="w-full">
                <SelectValue
                  placeholder={
                    value.senderUserId
                      ? 'Выберите счет'
                      : 'Сначала выберите отправителя'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Не выбрано</SelectItem>
                {senderAccounts.map((account) => (
                  <SelectItem key={account.id} value={String(account.id)}>
                    {formatAccountLabel(account)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-(--sea-ink)">
                Получатели
              </h3>
              <Button type="button" variant="outline" onClick={onAddRow}>
                Добавить строку
              </Button>
            </div>

            <div className="max-h-[45vh] space-y-3 overflow-y-auto pr-1">
              {value.items.map((item, index) => (
                <div
                  key={item.id}
                  className="grid gap-3 rounded-2xl border border-(--line) bg-(--surface) p-4 md:grid-cols-[1.6fr,0.8fr,1.4fr,auto]"
                >
                  <div className="space-y-2">
                    <Label htmlFor={`bulkReceiver-${index}`}>Счет получателя</Label>
                    <Select
                      value={item.receiverAccountId || 'none'}
                      onValueChange={(nextValue) =>
                        updateItem(index, {
                          receiverAccountId:
                            nextValue === 'none' ? '' : nextValue,
                        })
                      }
                    >
                      <SelectTrigger
                        id={`bulkReceiver-${index}`}
                        className="w-full"
                      >
                        <SelectValue placeholder="Выберите счет" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Не выбрано</SelectItem>
                        {receiverAccounts.map((account) => (
                          <SelectItem key={account.id} value={String(account.id)}>
                            {formatAccountLabel(account)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`bulkAmount-${index}`}>Сумма</Label>
                    <Input
                      id={`bulkAmount-${index}`}
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.amount}
                      onChange={(event) =>
                        updateItem(index, { amount: event.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`bulkDescription-${index}`}>Описание</Label>
                    <Input
                      id={`bulkDescription-${index}`}
                      value={item.description}
                      onChange={(event) =>
                        updateItem(index, { description: event.target.value })
                      }
                    />
                  </div>

                  <div className="flex items-end justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={value.items.length === 1}
                      onClick={() => onRemoveRow(index)}
                    >
                      Удалить
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Выполнение...' : 'Создать операции'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
