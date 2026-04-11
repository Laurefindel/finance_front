import { createFileRoute } from '@tanstack/react-router'
import { AccountsPageContent } from '#/features/accounts/accounts-page-content'

export const Route = createFileRoute('/accounts')({
  component: AccountsPage,
})

function AccountsPage() {
  return <AccountsPageContent />
}
