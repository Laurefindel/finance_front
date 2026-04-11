import { ApiProblemSchema, type ApiProblem } from '../schemas'

export function parseApiProblem(responseBody: unknown): ApiProblem | null {
  const parsedProblem = ApiProblemSchema.safeParse(responseBody)
  return parsedProblem.success ? parsedProblem.data : null
}

export function buildApiErrorMessage(problem: ApiProblem | null, fallback: string) {
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
