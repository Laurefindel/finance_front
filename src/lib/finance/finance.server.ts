import { z } from 'zod'
import { ApiProblemSchema, type ApiProblem } from './schemas'

const FINANCE_API_BASE_URL =
  'https://financeapplaurefindel-e0f1853e72fd.herokuapp.com'

type QueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<string | number | boolean>

interface FinanceRequestBaseOptions {
  path: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  query?: Record<string, QueryValue>
  body?: unknown
}

interface FinanceRequestWithSchemaOptions<T> extends FinanceRequestBaseOptions {
  schema: z.ZodType<T>
}

type FinanceRequestOptions<T> =
  | FinanceRequestBaseOptions
  | FinanceRequestWithSchemaOptions<T>

function buildUrl(path: string, query?: Record<string, QueryValue>) {
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

async function parseResponseBody(response: Response): Promise<unknown> {
  const text = await response.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function buildApiErrorMessage(problem: ApiProblem | null, fallback: string) {
  if (!problem) {
    return fallback
  }

  const messageParts: string[] = []

  if (problem.message) {
    messageParts.push(problem.message)
  } else if (problem.error) {
    messageParts.push(problem.error)
  } else {
    messageParts.push(fallback)
  }

  if (problem.validationErrors) {
    const details = Object.entries(problem.validationErrors)
      .map(([field, value]) => `${field}: ${value}`)
      .join('; ')

    if (details) {
      messageParts.push(details)
    }
  }

  return messageParts.join(' | ')
}

export async function financeRequest<T>(
  options: FinanceRequestWithSchemaOptions<T>,
): Promise<T>
export async function financeRequest(
  options: FinanceRequestBaseOptions,
): Promise<unknown>
export async function financeRequest<T>(
  options: FinanceRequestOptions<T>,
): Promise<T | unknown> {
  const { path, method = 'GET', query, body } = options
  const schema = 'schema' in options ? options.schema : undefined

  const url = buildUrl(path, query)

  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const responseBody = await parseResponseBody(response)

  if (!response.ok) {
    const parsedProblem = ApiProblemSchema.safeParse(responseBody)
    const fallbackMessage = `Finance API request failed (${response.status})`

    throw new Error(
      buildApiErrorMessage(
        parsedProblem.success ? parsedProblem.data : null,
        fallbackMessage,
      ),
    )
  }

  if (!schema) {
    return responseBody
  }

  return schema.parse(responseBody)
}
