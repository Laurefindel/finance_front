import { FINANCE_API_BASE_URL } from './constants'
import type { QueryValue } from './types'

export function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = new URL(normalizedPath, FINANCE_API_BASE_URL)

  if (!query) {
    return url
  }

  for (const [key, rawValue] of Object.entries(query)) {
    if (rawValue === undefined || rawValue === null || rawValue === '') {
      continue
    }

    if (Array.isArray(rawValue)) {
      for (const value of rawValue) {
        url.searchParams.append(key, String(value))
      }
      continue
    }

    url.searchParams.set(key, String(rawValue))
  }

  return url
}
