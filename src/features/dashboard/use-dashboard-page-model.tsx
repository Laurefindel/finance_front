import { useQueries } from '@tanstack/react-query'
import {
  listAccountsFn,
  listCurrenciesFn,
  listRolesFn,
  listUsersFn,
  searchOperationsFn,
} from '#/lib/finance/finance.functions'
import { financeQueryKeys } from '#/lib/finance/queries/query-keys'
import type { DashboardStatCard } from './types'

export function useDashboardPageModel() {
  const [usersQuery, rolesQuery, currenciesQuery, accountsQuery, operationsQuery] =
    useQueries({
      queries: [
        {
          queryKey: financeQueryKeys.users,
          queryFn: () => listUsersFn(),
        },
        {
          queryKey: financeQueryKeys.roles,
          queryFn: () => listRolesFn(),
        },
        {
          queryKey: financeQueryKeys.currencies,
          queryFn: () => listCurrenciesFn(),
        },
        {
          queryKey: financeQueryKeys.accounts({}),
          queryFn: () => listAccountsFn({ data: {} }),
        },
        {
          queryKey: financeQueryKeys.operationsSearch({
            page: 1,
            size: 1,
          }),
          queryFn: () =>
            searchOperationsFn({
              data: {
                page: 0,
                size: 1,
                criteria: {},
              },
            }),
        },
      ],
    })

  const cards: DashboardStatCard[] = [
    {
      title: 'Пользователи',
      value: usersQuery.data?.length ?? 0,
      to: '/users',
      description: 'Регистрация и управление пользователями',
    },
    {
      title: 'Роли',
      value: rolesQuery.data?.length ?? 0,
      to: '/roles',
      description: 'Справочник ролей',
    },
    {
      title: 'Валюты',
      value: currenciesQuery.data?.length ?? 0,
      to: '/currencies',
      description: 'Коды и названия валют',
    },
    {
      title: 'Счета',
      value: accountsQuery.data?.length ?? 0,
      to: '/accounts',
      description: 'Баланс и счета пользователей',
    },
    {
      title: 'Операции',
      value: operationsQuery.data?.totalElements ?? 0,
      to: '/operations',
      description: 'Финансовые операции и поиск',
    },
  ]

  return {
    cards,
  }
}
