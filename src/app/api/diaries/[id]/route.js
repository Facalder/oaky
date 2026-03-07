import {
  deleteDiary,
  getDiaryById,
  updateDiary,
} from '@/modules/diaries/diaries-service'
import { ApiError } from '@/shared/errors/api-error'
import { ApiResponse } from '@/shared/utils/api-response'
import { rateLimiter } from '@/shared/utils/rate-limitter'

export async function GET(request, { params }) {
  const limit = rateLimiter(request)
  if (limit) return limit

  const url = request.url
  const { id } = await params

  try {
    const data = await getDiaryById(id, url)
    return ApiResponse.ok('Diary fetched successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to fetch diary')

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
    const data = await updateDiary(id, payload, url)
    return ApiResponse.ok('Diary updated successfully', data)
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to update diary')

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
    await deleteDiary(id, url)
    return ApiResponse.ok('Diary deleted successfully')
  } catch (error) {
    const apiError =
      error instanceof ApiError
        ? error
        : ApiError.server('Failed to delete diary')

    return ApiResponse.error(
      apiError.message,
      apiError.statusCode,
      apiError.errors,
    )
  }
}
