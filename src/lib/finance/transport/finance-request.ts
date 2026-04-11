import { buildApiErrorMessage, parseApiProblem } from './api-error'
import { buildUrl } from './build-url'
import { parseResponseBody } from './parse-response-body'
import type {
  FinanceRequestBaseOptions,
  FinanceRequestOptions,
  FinanceRequestWithSchemaOptions,
} from './types'

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
    const fallbackMessage = `Finance API request failed (${response.status})`

    throw new Error(
      buildApiErrorMessage(parseApiProblem(responseBody), fallbackMessage),
    )
  }

  if (!schema) {
    return responseBody
  }

  return schema.parse(responseBody)
}
