import { ApiError } from '@/shared/errors/api-error'
import { logger } from '@/shared/utils/logger'

export function handleError(error, { action, endpoint, id, startTime }) {
  logger.error(`Failed at ${action}`, {
    action,
    endpoint,
    ...(id !== undefined && { id }),
    errorName: error?.name,
    errorMessage: error?.message,
    duration: `${Date.now() - startTime}ms`,
    timestamp: new Date().toISOString(),
  })

  if (error?.name === 'ApiError') throw error

  throw error?.name === 'ZodError'
    ? ApiError.validation('Validation failed', error.errors)
    : ApiError.server(`Failed at ${action}`)
}
