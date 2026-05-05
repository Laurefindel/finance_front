import type { ReactNode } from 'react'
import { DataTable } from '#/components/data/data-table'
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import type { TableCardProps } from '#/features/shared/contracts'
import type { CurrencyResponse } from '#/lib/finance/schemas'

type CurrenciesTableCardProps = Readonly<
  TableCardProps<CurrencyResponse> & {
    headerAction?: ReactNode
    footerAction?: ReactNode
  }
>

export function CurrenciesTableCard(
  props: CurrenciesTableCardProps,
) {
  const { columns, data, errorMessage, headerAction, footerAction } = props

  return (
    <Card>
      <CardHeader>
        <CardTitle>Список валют</CardTitle>
        {headerAction ? <CardAction>{headerAction}</CardAction> : null}
      </CardHeader>

      <CardContent>
        {errorMessage ? (
          <p className="text-sm text-destructive">{errorMessage}</p>
        ) : (
          <DataTable columns={columns} data={data} />
        )}
      </CardContent>
      {footerAction ? (
        <CardFooter className="justify-end">{footerAction}</CardFooter>
      ) : null}
    </Card>
  )
}