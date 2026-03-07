import {
  createDailyStatistic,
  getAllDailyStatistics,
} from '@/modules/daily-statistics/daily-statistics-service'
import { ApiError } from '@/shared/errors/api-error'
import { ApiResponse } from '@/shared/utils/api-response'
import { withAuth } from '@/shared/middlewares/with-auth'
import { rateLimiter } from '@/shared/utils/rate-limitter'

export const GET = withAuth(async function (request, _context, userId) {
  const limit = rateLimiter(request)
  if (limit) return limit

  const url = request.url

  try {
    const data = await getAllDailyStatistics(url, userId)
    return ApiResponse.ok('Daily statistics fetched successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to fetch daily statistics')

    return ApiResponse.error(apiError.message, apiError.statusCode, apiError.errors)
  }
})

export const POST = withAuth(async function (request, _context, userId) {
  const limit = rateLimiter(request)
  if (limit) return limit

  const url = request.url

  try {
    const payload = await request.json()
    const data = await createDailyStatistic(payload, url, userId)
    return ApiResponse.created('Daily statistic created successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to create daily statistic')

    return ApiResponse.error(apiError.message, apiError.statusCode, apiError.errors)
  }
})
