import { useState, type SyntheticEvent } from 'react'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import type { CurrencyResponse } from '#/lib/finance/schemas'

interface UpdateCurrencyFormState {
  code: string
  name: string
}

interface CurrenciesUpdateDialogButtonProps {
  currency: CurrencyResponse
  isPending: boolean
  onUpdate: (id: number, payload: UpdateCurrencyFormState) => Promise<void>
}

function createInitialForm(currency: CurrencyResponse): UpdateCurrencyFormState {
  return {
    code: currency.code?.trim().toUpperCase() ?? '',
    name: currency.name?.trim() ?? '',
  }
}

export function CurrenciesUpdateDialogButton({
  currency,
  isPending,
  onUpdate,
}: Readonly<CurrenciesUpdateDialogButtonProps>) {
  const id = currency.id
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState<UpdateCurrencyFormState>(
    createInitialForm(currency),
  )

  const onOpenChange = (nextOpen: boolean) => {
    setIsOpen(nextOpen)

    if (nextOpen) {
      setForm(createInitialForm(currency))
    }
  }

  const onSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!id) {
      return
    }

    await onUpdate(id, {
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
    })

    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-(--chip-line) bg-(--surface-strong) text-(--sea-ink) hover:bg-(--link-bg-hover)"
          disabled={!id || isPending}
        >
          Изменить
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Редактирование валюты</DialogTitle>
        </DialogHeader>

        <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor={`currencyCodeUpdate-${id ?? 'new'}`}>Новый код</Label>
            <Input
              id={`currencyCodeUpdate-${id ?? 'new'}`}
              maxLength={3}
              value={form.code}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, code: event.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`currencyNameUpdate-${id ?? 'new'}`}>Новое название</Label>
            <Input
              id={`currencyNameUpdate-${id ?? 'new'}`}
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              required
            />
          </div>

          <div className="md:col-span-2">
            <Button type="submit" disabled={isPending || !id}>
              {isPending ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
