import { createDiary, getAllDiaries } from '@/modules/diaries/diaries-service'
import { ApiError } from '@/shared/errors/api-error'
import { ApiResponse } from '@/shared/utils/api-response'
import { withAuth } from '@/shared/middlewares/with-auth'
import { rateLimiter } from '@/shared/utils/rate-limitter'

export const GET = withAuth(async function (request, _context, userId) {
  const limit = rateLimiter(request)
  if (limit) return limit

  const url = request.url

  try {
    const data = await getAllDiaries(url, userId)
    return ApiResponse.ok('Diaries fetched successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to fetch diaries')

    return ApiResponse.error(apiError.message, apiError.statusCode, apiError.errors)
  }
})

export const POST = withAuth(async function (request, _context, userId) {
  const limit = rateLimiter(request)
  if (limit) return limit

  const url = request.url

  try {
    const payload = await request.json()
    const data = await createDiary(payload, url, userId)
    return ApiResponse.created('Diary created successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to create diary')

    return ApiResponse.error(apiError.message, apiError.statusCode, apiError.errors)
  }
})
