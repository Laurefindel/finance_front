import { useState } from 'react'
import { Button } from '#/components/ui/button'
import type { ComponentProps } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'

type ButtonProps = ComponentProps<typeof Button>

interface ConfirmDialogButtonProps {
  readonly triggerLabel: string
  readonly title: string
  readonly description: string
  readonly confirmLabel?: string
  readonly cancelLabel?: string
  readonly onConfirm: () => Promise<void> | void
  readonly disabled?: boolean
  readonly isPending?: boolean
  readonly triggerVariant?: ButtonProps['variant']
  readonly triggerSize?: ButtonProps['size']
}

export function ConfirmDialogButton({
  triggerLabel,
  title,
  description,
  confirmLabel = 'Подтвердить',
  cancelLabel = 'Отмена',
  onConfirm,
  disabled = false,
  isPending = false,
  triggerVariant = 'destructive',
  triggerSize = 'sm',
}: ConfirmDialogButtonProps) {
  const [open, setOpen] = useState(false)

  const handleConfirm = async () => {
    try {
      await onConfirm()
      setOpen(false)
    } catch {
      // Domain layer already reports errors via notifications/toasts.
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={triggerVariant}
          size={triggerSize}
          disabled={disabled || isPending}
        >
          {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent showCloseButton={!isPending}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? 'Выполнение...' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}