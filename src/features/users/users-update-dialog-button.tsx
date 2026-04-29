import { useState } from 'react'
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
import type { UserResponse } from '#/lib/finance/schemas'

interface UpdateUserFormState {
  firstName: string
  lastName: string
  email: string
  password: string
}

interface UsersUpdateDialogButtonProps {
  readonly user: UserResponse
  readonly isPending: boolean
  readonly onUpdate: (id: number, payload: UpdateUserFormState) => Promise<void>
}

function createInitialForm(user: UserResponse): UpdateUserFormState {
  return {
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    email: user.email ?? '',
    password: '',
  }
}

export function UsersUpdateDialogButton({
  user,
  isPending,
  onUpdate,
}: UsersUpdateDialogButtonProps) {
  const id = user.id
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState<UpdateUserFormState>(createInitialForm(user))

  const onOpenChange = (nextOpen: boolean) => {
    setIsOpen(nextOpen)

    if (nextOpen) {
      setForm(createInitialForm(user))
    }
  }

  const onSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!id) {
      return
    }

    await onUpdate(id, {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      password: form.password,
    })

    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={!id || isPending}>
          Изменить
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Изменить пользователя</DialogTitle>
        </DialogHeader>

        <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor={`firstNameUpdate-${id ?? 'new'}`}>Имя</Label>
            <Input
              id={`firstNameUpdate-${id ?? 'new'}`}
              value={form.firstName}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, firstName: event.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`lastNameUpdate-${id ?? 'new'}`}>Фамилия</Label>
            <Input
              id={`lastNameUpdate-${id ?? 'new'}`}
              value={form.lastName}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, lastName: event.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`emailUpdate-${id ?? 'new'}`}>Email</Label>
            <Input
              id={`emailUpdate-${id ?? 'new'}`}
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`passwordUpdate-${id ?? 'new'}`}>Новый пароль</Label>
            <Input
              id={`passwordUpdate-${id ?? 'new'}`}
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
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
