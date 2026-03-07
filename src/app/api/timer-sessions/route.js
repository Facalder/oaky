import {
  createTimerSession,
  getAllTimerSessions,
} from '@/modules/timer-sessions/timer-sessions-service'
import { ApiError } from '@/shared/errors/api-error'
import { ApiResponse } from '@/shared/utils/api-response'
import { withAuth } from '@/shared/middlewares/with-auth'
import { rateLimiter } from '@/shared/utils/rate-limitter'

export const GET = withAuth(async function (request, _context, userId) {
  const limit = rateLimiter(request)
  if (limit) return limit

  const url = request.url

  try {
    const data = await getAllTimerSessions(url, userId)
    return ApiResponse.ok('Timer sessions fetched successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to fetch timer sessions')

    return ApiResponse.error(apiError.message, apiError.statusCode, apiError.errors)
  }
})

export const POST = withAuth(async function (request, _context, userId) {
  const limit = rateLimiter(request)
  if (limit) return limit

  const url = request.url

  try {
    const payload = await request.json()
    const data = await createTimerSession(payload, url, userId)
    return ApiResponse.created('Timer session started successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to start timer session')

    return ApiResponse.error(apiError.message, apiError.statusCode, apiError.errors)
  }
})
