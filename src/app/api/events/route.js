import { createEvent, getAllEvents } from '@/modules/events/events-service'
import { ApiError } from '@/shared/errors/api-error'
import { ApiResponse } from '@/shared/utils/api-response'
import { withAuth } from '@/shared/middlewares/with-auth'
import { rateLimiter } from '@/shared/utils/rate-limitter'

export const GET = withAuth(async function (request, _context, userId) {
  const limit = rateLimiter(request)
  if (limit) return limit

  const url = request.url

  try {
    const data = await getAllEvents(url, userId)
    return ApiResponse.ok('Events fetched successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to fetch events')

    return ApiResponse.error(apiError.message, apiError.statusCode, apiError.errors)
  }
})

export const POST = withAuth(async function (request, _context, userId) {
  const limit = rateLimiter(request)
  if (limit) return limit

  const url = request.url

  try {
    const payload = await request.json()
    const data = await createEvent(payload, url, userId)
    return ApiResponse.created('Event created successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to create event')

    return ApiResponse.error(apiError.message, apiError.statusCode, apiError.errors)
  }
})
