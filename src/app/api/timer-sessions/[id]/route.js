import {
  deleteTimerSession,
  getTimerSessionById,
  updateTimerSession,
} from '@/modules/timer-sessions/timer-sessions-service'
import { ApiError } from '@/shared/errors/api-error'
import { ApiResponse } from '@/shared/utils/api-response'
import { rateLimiter } from '@/shared/utils/rate-limitter'

export async function GET(request, { params }) {
  const limit = rateLimiter(request)
  if (limit) return limit

  const url = request.url
  const { id } = await params

  try {
    const data = await getTimerSessionById(id, url)
    return ApiResponse.ok('Timer session fetched successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to fetch timer session')

    return ApiResponse.error(
      apiError.message,
      apiError.statusCode,
      apiError.errors,
    )
  }
}

export async function PATCH(request, { params }) {
  const limit = rateLimiter(request)
  if (limit) return limit

  const url = request.url
  const { id } = await params

  try {
    const payload = await request.json()
    const data = await updateTimerSession(id, payload, url)
    return ApiResponse.ok('Timer session updated successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to update timer session')

    return ApiResponse.error(
      apiError.message,
      apiError.statusCode,
      apiError.errors,
    )
  }
}

export async function DELETE(request, { params }) {
  const limit = rateLimiter(request)
  if (limit) return limit

  const url = request.url
  const { id } = await params

  try {
    await deleteTimerSession(id, url)
    return ApiResponse.ok('Timer session deleted successfully')
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to delete timer session')

    return ApiResponse.error(
      apiError.message,
      apiError.statusCode,
      apiError.errors,
    )
  }
}
