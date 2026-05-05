import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#/components/ui/sheet'
import { AccountsCreateCard } from '#/features/accounts/accounts-create-card'
import { AccountsFiltersCard } from '#/features/accounts/accounts-filters-card'
import { AccountsReplenishCard } from '#/features/accounts/accounts-replenish-card'
import { AccountsTableCard } from '#/features/accounts/accounts-table-card'
import { createAccountsTableColumns } from '#/features/accounts/accounts-table-columns'
import { useAccountsPageModel } from '#/features/accounts/use-accounts-page-model'
import { AsyncReplenishStartCard } from '#/features/async-replenish/async-replenish-start-card'
import {
  type AsyncToastDetails,
  showAsyncStartedToast,
  showAsyncStartFailedToast,
  showAsyncStartSubmittingToast,
  useAsyncReplenishToastSync,
} from '#/features/async-replenish/use-async-replenish-toast'
import { useAsyncReplenishPageModel } from '#/features/async-replenish/use-async-replenish-page-model'
import { PageHeaderSection } from '#/features/shared/page-header-section'

export function AccountsPageContent() {
  const model = useAccountsPageModel({
    onSuccess: (message) => toast.success(message),
    onError: (message) => toast.error(message),
  })

  const getAccountLabel = (accountId: string) => {
    const id = Number(accountId)
    const account = model.lookups.accounts.find((item) => item.id === id)

    if (!account) {
      return '—'
    }

    const owner = `${account.user?.firstName ?? ''} ${
      account.user?.lastName ?? ''
    }`.trim()
    const currency = account.currency?.code?.trim().toUpperCase() || '---'

    return `${owner || 'Без владельца'} · ${currency}`
  }

  const asyncModel = useAsyncReplenishPageModel({
    onValidationError: (message) => toast.error(message),
    onStartSubmitting: (context) =>
      showAsyncStartSubmittingToast({
        accountLabel: getAccountLabel(context.accountId),
        amountLabel: context.amount?.trim() || '—',
      }),
    onStartSuccess: (_taskId, context) =>
      showAsyncStartedToast({
        accountLabel: getAccountLabel(context.accountId),
        amountLabel: context.amount?.trim() || '—',
      }),
    onStartError: (_message, context) =>
      showAsyncStartFailedToast({
        accountLabel: getAccountLabel(context.accountId),
        amountLabel: context.amount?.trim() || '—',
      }),
  })

  const toastDetails: AsyncToastDetails = {
    accountLabel: getAccountLabel(asyncModel.toastSync.details.accountId),
    amountLabel: asyncModel.toastSync.details.amount?.trim() || '—',
  }

  useAsyncReplenishToastSync({
    ...asyncModel.toastSync,
    details: toastDetails,
  })

  const [replenishDialog, setReplenishDialog] = useState<
    { type: 'sync' | 'async'; accountId: number } | null
  >(null)

  const openReplenishDialog = (accountId: number) => {
    model.replenish.setForm((prev) => ({
      ...prev,
      id: String(accountId),
      amount: '',
    }))
    setReplenishDialog({ type: 'sync', accountId })
  }

  const openAsyncDialog = (accountId: number) => {
    asyncModel.setForm((prev) => ({
      ...prev,
      accountId: String(accountId),
      amount: '',
    }))
    setReplenishDialog({ type: 'async', accountId })
  }

  const closeReplenishDialog = () => {
    setReplenishDialog(null)
  }

  const columns = useMemo(
    () =>
      createAccountsTableColumns({
        isDeletePending: model.delete.isPending,
        onDelete: model.delete.onDelete,
        onOpenReplenish: openReplenishDialog,
        onOpenAsync: openAsyncDialog,
      }),
    [
      model.delete.isPending,
      model.delete.onDelete,
      openAsyncDialog,
      openReplenishDialog,
    ],
  )

  return (
    <main className="page-wrap space-y-6 px-4 py-8">
      <PageHeaderSection
        kicker="Счета"
        title="Счета"
        description="Создание, фильтрация, синхронное и асинхронное пополнение, удаление счетов."
      />

      <AccountsTableCard
        columns={columns}
        data={model.rows}
        errorMessage={model.rowsErrorMessage}
        headerAction={
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                Фильтры
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle>Фильтры счетов</SheetTitle>
              </SheetHeader>
              <div className="p-4">
                <AccountsFiltersCard
                  value={model.filters.form}
                  onChange={model.filters.setForm}
                  onReset={model.filters.onReset}
                  users={model.lookups.users}
                  currencies={model.lookups.currencies}
                />
              </div>
            </SheetContent>
          </Sheet>
        }
        footerAction={
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">Создать счет</Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Новый счет</DialogTitle>
              </DialogHeader>
              <AccountsCreateCard
                value={model.create.form}
                onChange={model.create.setForm}
                onApply={model.create.onApply}
                isPending={model.create.isPending}
                users={model.lookups.users}
                currencies={model.lookups.currencies}
              />
            </DialogContent>
          </Dialog>
        }
      />

      <Dialog
        open={replenishDialog?.type === 'sync'}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            closeReplenishDialog()
          }
        }}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Пополнение счета</DialogTitle>
          </DialogHeader>
          <AccountsReplenishCard
            value={model.replenish.form}
            onChange={model.replenish.setForm}
            onApply={model.replenish.onApply}
            isPending={model.replenish.isPending}
            accounts={model.lookups.accounts}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={replenishDialog?.type === 'async'}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            closeReplenishDialog()
          }
        }}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Асинхронное пополнение</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <AsyncReplenishStartCard
              value={asyncModel.form}
              onChange={asyncModel.setForm}
              onApply={asyncModel.onApply}
              isPending={asyncModel.isSubmitPending}
              accounts={model.lookups.accounts}
            />
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
